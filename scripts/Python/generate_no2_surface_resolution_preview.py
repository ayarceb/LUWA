#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
LUWA NO2 surface four-resolution overlay generator.

Purpose
-------
Generate browser-ready Leaflet overlay products from four LOTOS-EUROS
conc-3d NetCDF files. The generated products are intended to be loaded by
map.html and drawn directly on the existing LUWA map as image overlays.

Input files expected in the same folder by default:

    LE_model_conc-3d_20240703_init.nc
    LE_model_conc-3d_20240703_005.nc
    LE_model_conc-3d_20240703_0025.nc
    LE_model_conc-3d_20240703_001.nc

Output folder by default:

    luwa_products/no2_surface_20240703/

Generated files:

    luwa_no2_surface_layers_20240703_t00.json
    luwa_no2_surface_layers_20240703_t06.json
    luwa_no2_surface_layers_20240703_t12.json
    luwa_no2_surface_layers_20240703_t18.json

    no2_surface_20240703_t00_init.png
    no2_surface_20240703_t00_005.png
    no2_surface_20240703_t00_0025.png
    no2_surface_20240703_t00_001.png
    ... equivalent files for t06, t12, t18

How to use
----------
Place this file near the NetCDF files and run:

    pip install xarray netCDF4 numpy pillow
    python generate_no2_surface_resolution_layers.py

Then deploy/copy the whole output folder beside map.html:

    map.html
    luwa_products/no2_surface_20240703/*.json
    luwa_products/no2_surface_20240703/*.png

The browser does not read NetCDF files. This script reads NetCDF on the
backend/local machine and creates lightweight web products.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Dict, Iterable, Optional, Tuple

import numpy as np
import xarray as xr
from PIL import Image


DEFAULT_FILES: Dict[str, str] = {
    "Domain init | 0.20°": "LE_model_conc-3d_20240703_init.nc",
    "Domain 0.05°": "LE_model_conc-3d_20240703_005.nc",
    "Domain 0.025°": "LE_model_conc-3d_20240703_0025.nc",
    "Domain 0.01°": "LE_model_conc-3d_20240703_001.nc",
}

LAYER_CODES: Dict[str, str] = {
    "Domain init | 0.20°": "init",
    "Domain 0.05°": "005",
    "Domain 0.025°": "0025",
    "Domain 0.01°": "001",
}

LAT_NAMES = ["lat", "latitude", "latitud", "y", "nav_lat"]
LON_NAMES = ["lon", "longitude", "longitud", "x", "nav_lon"]
LEVEL_NAMES = ["level", "lev", "height", "altitude", "z", "hlevel"]
TIME_NAMES = ["time", "datetime"]


class ProductError(RuntimeError):
    """Raised when the LUWA product cannot be generated."""


def find_name(ds: xr.Dataset, candidates: Iterable[str]) -> Optional[str]:
    """Find a coordinate, variable, or dimension name from common aliases."""
    names = list(ds.coords) + list(ds.data_vars) + list(ds.dims)
    lower_map = {str(name).lower(): str(name) for name in names}

    for candidate in candidates:
        key = candidate.lower()
        if key in lower_map:
            return lower_map[key]

    for name in names:
        lname = str(name).lower()
        if any(candidate.lower() in lname for candidate in candidates):
            return str(name)

    return None


def find_variable(ds: xr.Dataset, wanted: str) -> str:
    """Find the requested data variable with a strict-first strategy."""
    wanted_lower = wanted.lower()

    if wanted in ds.data_vars:
        return wanted

    for var in ds.data_vars:
        if str(var).lower() == wanted_lower:
            return str(var)

    for var in ds.data_vars:
        if wanted_lower in str(var).lower():
            return str(var)

    raise ProductError(
        f"Variable '{wanted}' was not found. Available data variables: "
        f"{list(ds.data_vars)}"
    )


def normalize_longitudes(lons: np.ndarray) -> np.ndarray:
    """Convert 0..360 longitudes to -180..180 if required."""
    arr = np.asarray(lons, dtype=float)
    if np.nanmax(arr) > 180.0:
        arr = ((arr + 180.0) % 360.0) - 180.0
    return arr


def should_convert_to_ppb(units: str, values: np.ndarray, force_ppb: bool) -> bool:
    """
    Decide whether NO2 values should be converted to ppb.

    LOTOS-EUROS gas concentrations are commonly stored as mole mole-1.
    If metadata is incomplete, a magnitude around 1e-8 is a strong signal
    that ppb is the expected display unit.
    """
    if force_ppb:
        return True

    u = (units or "").lower().replace(" ", "")
    if "molemole-1" in u or "molmol-1" in u or "mol/mol" in u:
        return True

    finite = values[np.isfinite(values)]
    if finite.size == 0:
        return False

    p98 = float(np.nanpercentile(np.abs(finite), 98))
    return 0.0 < p98 < 1.0e-5


def select_surface_field(
    nc_path: Path,
    variable: str,
    time_index: int,
    level_index: int,
    max_points_axis: int,
    force_ppb: bool,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, Dict]:
    """Open one NetCDF file and return a 2D NO2 surface field."""
    if not nc_path.exists():
        raise FileNotFoundError(f"Missing NetCDF file: {nc_path}")

    ds = xr.open_dataset(nc_path)

    try:
        var_name = find_variable(ds, variable)
        lat_name = find_name(ds, LAT_NAMES)
        lon_name = find_name(ds, LON_NAMES)
        level_name = find_name(ds, LEVEL_NAMES)
        time_name = find_name(ds, TIME_NAMES)

        if lat_name is None or lon_name is None:
            raise ProductError(
                f"Could not identify latitude/longitude in {nc_path}. "
                f"coords={list(ds.coords)}, dims={list(ds.dims)}"
            )

        da = ds[var_name]
        selectors = {}

        for dim in da.dims:
            if dim == lat_name or dim == lon_name:
                continue

            dim_lower = str(dim).lower()

            if time_name and dim == time_name:
                selectors[dim] = min(time_index, ds.dims[dim] - 1)
            elif level_name and dim == level_name:
                selectors[dim] = min(level_index, ds.dims[dim] - 1)
            elif "time" in dim_lower:
                selectors[dim] = min(time_index, ds.dims[dim] - 1)
            elif any(key in dim_lower for key in ["level", "lev", "height", "alt", "z"]):
                selectors[dim] = min(level_index, ds.dims[dim] - 1)
            else:
                selectors[dim] = 0

        field = da.isel(selectors)

        if lat_name not in field.dims or lon_name not in field.dims:
            raise ProductError(
                f"After selection, '{var_name}' is not a lat/lon field. "
                f"Remaining dims: {field.dims}"
            )

        field = field.transpose(lat_name, lon_name)
        values = np.asarray(field.values, dtype=float)
        lats = np.asarray(ds[lat_name].values, dtype=float)
        lons = normalize_longitudes(np.asarray(ds[lon_name].values, dtype=float))

        if lats.ndim != 1 or lons.ndim != 1:
            raise ProductError(
                "This product expects 1D latitude and longitude coordinates. "
                "Curvilinear grids require a different renderer."
            )

        lon_order = np.argsort(lons)
        lons = lons[lon_order]
        values = values[:, lon_order]

        if lats[0] > lats[-1]:
            lats = lats[::-1]
            values = values[::-1, :]

        step_lat = max(1, len(lats) // max_points_axis)
        step_lon = max(1, len(lons) // max_points_axis)

        values = values[::step_lat, ::step_lon]
        lats = lats[::step_lat]
        lons = lons[::step_lon]

        original_units = str(da.attrs.get("units", ""))
        converted = should_convert_to_ppb(original_units, values, force_ppb=force_ppb)

        if converted:
            values = values * 1.0e9
            display_units = "ppb"
        else:
            display_units = original_units or "unknown"

        meta = {
            "file": str(nc_path),
            "variable": var_name,
            "long_name": str(da.attrs.get("long_name", var_name)),
            "original_units": original_units,
            "display_units": display_units,
            "converted_to_ppb": converted,
            "dims": list(map(str, da.dims)),
            "selectors": {str(k): int(v) for k, v in selectors.items()},
            "lat_name": lat_name,
            "lon_name": lon_name,
            "level_name": level_name,
            "time_name": time_name,
            "shape": list(values.shape),
        }

        if level_name and level_name in ds:
            try:
                levels = np.asarray(ds[level_name].values).ravel()
                meta["level_values_first"] = [float(x) for x in levels[:8] if np.isfinite(x)]
            except Exception:
                meta["level_values_first"] = []

        if time_name and time_name in ds:
            try:
                times = np.asarray(ds[time_name].values).ravel()
                meta["time_values_first"] = [str(x) for x in times[:8]]
            except Exception:
                meta["time_values_first"] = []

        return values, lats, lons, meta

    finally:
        ds.close()


def colorize(values: np.ndarray, vmin: float, vmax: float) -> np.ndarray:
    """Create an RGBA array using a blue-cyan-white-orange-red ramp."""
    arr = np.asarray(values, dtype=float)
    rgba = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)

    valid = np.isfinite(arr)
    if not np.any(valid):
        return np.flipud(rgba)

    denom = vmax - vmin
    if denom <= 0.0:
        denom = 1.0

    pct = np.clip((arr - vmin) / denom, 0.0, 1.0)

    r = np.zeros_like(pct)
    g = np.zeros_like(pct)
    b = np.zeros_like(pct)

    low = pct < 0.5
    t_low = pct * 2.0
    r[low] = 255.0 * t_low[low]
    g[low] = 85.0 + 170.0 * t_low[low]
    b[low] = 255.0

    high = ~low
    t_high = (pct - 0.5) * 2.0
    r[high] = 255.0
    g[high] = 255.0 * (1.0 - t_high[high])
    b[high] = 30.0 * (1.0 - t_high[high])

    rgba[..., 0] = np.where(valid, r, 0).astype(np.uint8)
    rgba[..., 1] = np.where(valid, g, 0).astype(np.uint8)
    rgba[..., 2] = np.where(valid, b, 0).astype(np.uint8)
    rgba[..., 3] = np.where(valid, 230, 0).astype(np.uint8)

    # Leaflet image overlays have north at the top of the image.
    return np.flipud(rgba)


def save_png(rgba: np.ndarray, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray(rgba, mode="RGBA")
    img.save(path, format="PNG", optimize=True)


def values_to_json(values: np.ndarray):
    out = []
    for row in values:
        out.append([None if not np.isfinite(x) else float(x) for x in row])
    return out


def safe_percentiles(values: np.ndarray) -> Dict[str, float]:
    finite = values[np.isfinite(values)]
    if finite.size == 0:
        return {"min": None, "p50": None, "p98": None, "max": None}
    return {
        "min": float(np.nanmin(finite)),
        "p50": float(np.nanpercentile(finite, 50)),
        "p98": float(np.nanpercentile(finite, 98)),
        "max": float(np.nanmax(finite)),
    }


def generate_for_time(
    time_index: int,
    input_dir: Path,
    output_dir: Path,
    date_string: str,
    variable: str,
    level_index: int,
    max_points_axis: int,
    force_ppb: bool,
) -> Path:
    print(f"\n[INFO] Generating time index {time_index:02d}")

    raw = {}
    valid_values = []

    for label, filename in DEFAULT_FILES.items():
        nc_path = input_dir / filename
        print(f"[READ] {label}: {nc_path}")

        values, lats, lons, meta = select_surface_field(
            nc_path=nc_path,
            variable=variable,
            time_index=time_index,
            level_index=level_index,
            max_points_axis=max_points_axis,
            force_ppb=force_ppb,
        )

        finite = values[np.isfinite(values)]
        if finite.size > 0:
            valid_values.append(finite)

        raw[label] = {
            "values": values,
            "lats": lats,
            "lons": lons,
            "metadata": meta,
        }

        stats = safe_percentiles(values)
        print(f"  selected dims: {meta['selectors']}")
        print(f"  shape: {values.shape}")
        print(
            f"  bounds: S={float(np.nanmin(lats)):.4f}, "
            f"N={float(np.nanmax(lats)):.4f}, "
            f"W={float(np.nanmin(lons)):.4f}, "
            f"E={float(np.nanmax(lons)):.4f}"
        )
        print(
            f"  stats: min={stats['min']}, p50={stats['p50']}, "
            f"p98={stats['p98']}, max={stats['max']} {meta['display_units']}"
        )

    if not valid_values:
        raise ProductError("No valid values found in the four NetCDF files.")

    combined = np.concatenate(valid_values)
    vmin = float(np.nanpercentile(combined, 2))
    vmax = float(np.nanpercentile(combined, 98))

    if vmax <= vmin:
        vmin = float(np.nanmin(combined))
        vmax = float(np.nanmax(combined))

    first_meta = next(iter(raw.values()))["metadata"]
    units = first_meta["display_units"]

    layers = {}

    for label, item in raw.items():
        code = LAYER_CODES.get(label, re.sub(r"[^a-z0-9]+", "_", label.lower()).strip("_"))
        png_name = f"no2_surface_{date_string}_t{time_index:02d}_{code}.png"
        png_path = output_dir / png_name

        rgba = colorize(item["values"], vmin=vmin, vmax=vmax)
        save_png(rgba, png_path)

        lats = item["lats"]
        lons = item["lons"]
        values = item["values"]

        layers[label] = {
            "code": code,
            "image": png_name,
            "bounds": {
                "south": float(np.nanmin(lats)),
                "north": float(np.nanmax(lats)),
                "west": float(np.nanmin(lons)),
                "east": float(np.nanmax(lons)),
            },
            "lats": [float(x) for x in lats],
            "lons": [float(x) for x in lons],
            "values": values_to_json(values),
            "stats": safe_percentiles(values),
            "metadata": item["metadata"],
        }

        print(f"[WRITE] {png_path}")

    product = {
        "product": "no2_surface_resolution_overlay",
        "case_id": f"mexico_{date_string}_four_resolution",
        "date": date_string,
        "variable": variable,
        "dimension": "3d",
        "level_index": int(level_index),
        "time_index": int(time_index),
        "units": units,
        "scale": {
            "method": "common_p02_p98",
            "vmin": vmin,
            "vmax": vmax,
        },
        "layers": layers,
    }

    json_path = output_dir / f"luwa_no2_surface_layers_{date_string}_t{time_index:02d}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(product, f, ensure_ascii=False, separators=(",", ":"))

    print(f"[WRITE] {json_path}")
    print(f"[OK] Common scale: {vmin:.4g} to {vmax:.4g} {units}")

    return json_path


def parse_time_indices(value: str):
    values = []
    for chunk in value.split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        values.append(int(chunk))
    return values


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", default=".", help="Folder containing the NetCDF files.")
    parser.add_argument(
        "--output-dir",
        default="luwa_products/no2_surface_20240703",
        help="Folder where JSON and PNG web products will be written.",
    )
    parser.add_argument("--date", default="20240703", help="Date string used in output filenames.")
    parser.add_argument("--variable", default="no2", help="NetCDF variable to render.")
    parser.add_argument("--level-index", type=int, default=0, help="Surface layer index. Default: 0.")
    parser.add_argument(
        "--time-indices",
        default="0,6,12,18",
        help="Comma-separated time indices to generate. Default: 0,6,12,18.",
    )
    parser.add_argument(
        "--max-points-axis",
        type=int,
        default=320,
        help="Maximum grid points per axis for the browser product.",
    )
    parser.add_argument(
        "--force-ppb",
        action="store_true",
        help="Force conversion from mole mole-1 to ppb.",
    )

    args = parser.parse_args()

    input_dir = Path(args.input_dir).resolve()
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    time_indices = parse_time_indices(args.time_indices)

    print("\nLUWA NO2 surface overlay generator")
    print(f"Input dir : {input_dir}")
    print(f"Output dir: {output_dir}")
    print(f"Variable  : {args.variable}")
    print(f"Level     : {args.level_index}")
    print(f"Times     : {time_indices}")

    generated = []
    for time_index in time_indices:
        generated.append(
            generate_for_time(
                time_index=time_index,
                input_dir=input_dir,
                output_dir=output_dir,
                date_string=args.date,
                variable=args.variable,
                level_index=args.level_index,
                max_points_axis=args.max_points_axis,
                force_ppb=args.force_ppb,
            )
        )

    print("\nGenerated web products:")
    for path in generated:
        print(f"  {path}")

    print("\nDeploy this folder beside map.html:")
    print(f"  {output_dir.name}/")
    print("\nDone.")


if __name__ == "__main__":
    main()
