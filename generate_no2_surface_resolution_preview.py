#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
LUWA NO2 surface four-resolution preview generator.

Place this script in the same folder as the four LOTOS-EUROS NetCDF files:

    LE_model_conc-3d_20240703_init.nc
    LE_model_conc-3d_20240703_005.nc
    LE_model_conc-3d_20240703_0025.nc
    LE_model_conc-3d_20240703_001.nc

Then run:

    python generate_no2_surface_resolution_preview.py

By default it generates four static HTML previews:

    luwa_no2_surface_20240703_t00.html
    luwa_no2_surface_20240703_t06.html
    luwa_no2_surface_20240703_t12.html
    luwa_no2_surface_20240703_t18.html

Each preview contains a Leaflet map and a selector for the four resolutions.
The product reads variable `no2`, selects `level_index = 0` as surface layer,
and converts mole mole-1 to ppb when the units indicate a mixing ratio.
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import math
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

import numpy as np
import xarray as xr
from PIL import Image


DEFAULT_FILES: Dict[str, str] = {
    "Domain init | 0.20°": "LE_model_conc-3d_20240703_init.nc",
    "Domain 0.05°": "LE_model_conc-3d_20240703_005.nc",
    "Domain 0.025°": "LE_model_conc-3d_20240703_0025.nc",
    "Domain 0.01°": "LE_model_conc-3d_20240703_001.nc",
}

LAT_NAMES = ["lat", "latitude", "latitud", "y", "nav_lat"]
LON_NAMES = ["lon", "longitude", "longitud", "x", "nav_lon"]
LEVEL_NAMES = ["level", "lev", "height", "altitude", "z", "hlevel"]
TIME_NAMES = ["time", "datetime"]


class ProductError(RuntimeError):
    """Raised when the LUWA preview product cannot be generated."""


def find_coord_name(ds: xr.Dataset, candidates: Iterable[str]) -> Optional[str]:
    """Finds a coordinate, variable, or dimension name from common aliases."""
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


def find_variable(ds: xr.Dataset, wanted: str = "no2") -> str:
    """Finds the target scientific variable without relying on first-variable guesses."""
    wanted_lower = wanted.lower()

    if wanted in ds.data_vars:
        return wanted

    for var in ds.data_vars:
        if str(var).lower() == wanted_lower:
            return str(var)

    # Avoid accidentally using 'no' when asking for 'no2'.
    for var in ds.data_vars:
        parts = str(var).lower().replace("-", "_").split("_")
        if wanted_lower in parts:
            return str(var)

    for var in ds.data_vars:
        if wanted_lower in str(var).lower():
            return str(var)

    raise KeyError(
        f"Variable '{wanted}' was not found. Available data variables: {list(ds.data_vars)}"
    )


def normalize_longitudes(lons: np.ndarray) -> np.ndarray:
    """Converts 0..360 longitude convention to -180..180 when needed."""
    arr = np.asarray(lons, dtype=float)
    if arr.size and np.nanmax(arr) > 180.0:
        arr = ((arr + 180.0) % 360.0) - 180.0
    return arr


def parse_time_indices(text: str) -> List[int]:
    values: List[int] = []
    for item in text.split(","):
        item = item.strip()
        if not item:
            continue
        values.append(int(item))
    if not values:
        raise argparse.ArgumentTypeError("At least one time index is required.")
    return values


def units_are_mixing_ratio(units: str) -> bool:
    u = (units or "").strip().lower()
    return any(
        token in u
        for token in [
            "mole mole-1",
            "mol mol-1",
            "mol/mol",
            "mole/mole",
            "vmr",
            "volume mixing ratio",
        ]
    )


def display_values_and_units(
    values: np.ndarray,
    original_units: str,
    requested_ppb: bool,
) -> Tuple[np.ndarray, str, str]:
    """Converts NO2 mixing ratio to ppb only when units justify it."""
    if requested_ppb and units_are_mixing_ratio(original_units):
        return values * 1.0e9, "ppb", "mole mole-1 converted to ppb"

    units = original_units.strip() if original_units else "unknown"
    return values, units, "original units retained"


def select_no2_surface(
    nc_path: Path,
    variable: str,
    time_index: int,
    level_index: int,
    max_points_axis: int,
    convert_to_ppb: bool,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, dict]:
    """Reads one NetCDF file and returns a 2D NO2 surface field."""
    if not nc_path.exists():
        raise FileNotFoundError(f"Missing NetCDF file: {nc_path}")

    ds = xr.open_dataset(nc_path)

    try:
        var_name = find_variable(ds, variable)
        lat_name = find_coord_name(ds, LAT_NAMES)
        lon_name = find_coord_name(ds, LON_NAMES)
        level_name = find_coord_name(ds, LEVEL_NAMES)
        time_name = find_coord_name(ds, TIME_NAMES)

        if lat_name is None or lon_name is None:
            raise KeyError(
                f"Could not identify latitude/longitude in {nc_path}. "
                f"Coordinates: {list(ds.coords)} | dims: {list(ds.dims)}"
            )

        da = ds[var_name]
        selectors = {}

        for dim in da.dims:
            dim_lower = str(dim).lower()

            if dim == lat_name or dim == lon_name:
                continue

            if time_name and dim == time_name:
                selectors[dim] = time_index
            elif level_name and dim == level_name:
                selectors[dim] = level_index
            elif "time" in dim_lower:
                selectors[dim] = time_index
            elif any(key in dim_lower for key in ["level", "lev", "height", "alt", "z"]):
                selectors[dim] = level_index
            else:
                # Keep compatibility with files that have singleton or ancillary dimensions.
                selectors[dim] = 0

        try:
            layer = da.isel(selectors)
        except IndexError as exc:
            raise IndexError(
                f"Invalid selector for {nc_path.name}: {selectors}. "
                f"Variable dimensions are {dict(da.sizes)}"
            ) from exc

        if lat_name not in layer.dims or lon_name not in layer.dims:
            raise ProductError(
                f"After selection, variable '{var_name}' is not a lat/lon field. "
                f"Remaining dims: {layer.dims}"
            )

        layer = layer.transpose(lat_name, lon_name)

        values = np.asarray(layer.values, dtype=float)
        lats = np.asarray(ds[lat_name].values, dtype=float)
        lons = normalize_longitudes(np.asarray(ds[lon_name].values, dtype=float))

        if lats.ndim != 1 or lons.ndim != 1:
            raise ProductError(
                "This generator expects 1D latitude and longitude coordinates. "
                "Curvilinear grids need a polygon or raster reprojection renderer."
            )

        # Sort longitudes after normalization.
        lon_order = np.argsort(lons)
        lons = lons[lon_order]
        values = values[:, lon_order]

        # Ensure latitude order is south -> north for coordinate indexing.
        if lats[0] > lats[-1]:
            lats = lats[::-1]
            values = values[::-1, :]

        # Downsample to keep browser memory controlled. For the current LUWA domains
        # this usually keeps the native grid because dimensions are modest.
        nlat = len(lats)
        nlon = len(lons)
        step_lat = max(1, int(math.ceil(nlat / max_points_axis)))
        step_lon = max(1, int(math.ceil(nlon / max_points_axis)))

        values = values[::step_lat, ::step_lon]
        lats = lats[::step_lat]
        lons = lons[::step_lon]

        original_units = str(da.attrs.get("units", ""))
        values, display_units, conversion_note = display_values_and_units(
            values=values,
            original_units=original_units,
            requested_ppb=convert_to_ppb,
        )

        metadata = {
            "file": str(nc_path),
            "variable": var_name,
            "long_name": str(da.attrs.get("long_name", var_name)),
            "units_original": original_units,
            "units_display": display_units,
            "conversion_note": conversion_note,
            "dims": list(map(str, da.dims)),
            "sizes": {str(k): int(v) for k, v in da.sizes.items()},
            "selectors": {str(k): int(v) for k, v in selectors.items()},
            "lat_name": lat_name,
            "lon_name": lon_name,
            "level_name": level_name,
            "time_name": time_name,
            "lat_min": float(np.nanmin(lats)),
            "lat_max": float(np.nanmax(lats)),
            "lon_min": float(np.nanmin(lons)),
            "lon_max": float(np.nanmax(lons)),
            "shape": list(map(int, values.shape)),
            "step_lat": int(step_lat),
            "step_lon": int(step_lon),
        }

        if level_name and level_name in ds:
            try:
                metadata["level_values_first"] = np.asarray(ds[level_name].values).ravel()[:12].tolist()
            except Exception:
                metadata["level_values_first"] = []

        if time_name and time_name in ds:
            try:
                metadata["time_values_first"] = [
                    str(x) for x in np.asarray(ds[time_name].values).ravel()[:8]
                ]
            except Exception:
                metadata["time_values_first"] = []

    finally:
        ds.close()

    return values, lats, lons, metadata


def colorize(values: np.ndarray, vmin: float, vmax: float) -> np.ndarray:
    """
    Creates an RGBA image from a 2D array.

    The color ramp is simple and robust for browser use:
        blue -> cyan -> white -> orange -> red
    """
    arr = np.asarray(values, dtype=float)
    rgba = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)

    valid = np.isfinite(arr)
    if not np.any(valid):
        return np.flipud(rgba)

    denom = vmax - vmin
    if denom <= 0:
        denom = 1.0

    pct = (arr - vmin) / denom
    pct = np.clip(pct, 0.0, 1.0)

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

    # Leaflet image overlays expect north at the top of the image.
    return np.flipud(rgba)


def array_to_data_url(rgba: np.ndarray) -> str:
    img = Image.fromarray(rgba, mode="RGBA")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG", optimize=True)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def values_for_json(values: np.ndarray) -> List[List[Optional[float]]]:
    sanitized = np.asarray(values, dtype=float)
    out: List[List[Optional[float]]] = []
    for row in sanitized:
        out.append([None if not np.isfinite(x) else float(x) for x in row])
    return out


def build_html(
    layers: dict,
    output_html: Path,
    title: str,
    vmin: float,
    vmax: float,
    units: str,
    variable: str,
    time_index: int,
    level_index: int,
    date_label: str,
) -> None:
    layers_json = json.dumps(layers, ensure_ascii=False)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

  <style>
    html, body {{
      margin: 0;
      padding: 0;
      height: 100%;
      background: #0c0e12;
      font-family: monospace;
    }}

    #map {{
      width: 100%;
      height: 100%;
    }}

    .luwa-panel {{
      position: absolute;
      top: 18px;
      right: 18px;
      width: 380px;
      z-index: 1000;
      color: #f3f4f6;
      background: rgba(18, 22, 28, 0.92);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
    }}

    .luwa-panel h2 {{
      margin: 0 0 6px 0;
      font-size: 16px;
      font-weight: 700;
    }}

    .luwa-panel p {{
      margin: 0 0 12px 0;
      font-size: 12px;
      color: #b8beca;
      line-height: 1.4;
    }}

    .row {{
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin: 6px 0;
      font-size: 12px;
    }}

    .label {{
      color: #8f96a3;
    }}

    .value {{
      color: #ffffff;
      text-align: right;
    }}

    select, input[type="range"] {{
      width: 100%;
      margin-top: 6px;
      margin-bottom: 12px;
      font-family: monospace;
    }}

    select {{
      padding: 8px;
      color: #f3f4f6;
      background: #181d25;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 6px;
    }}

    .legend-bar {{
      height: 12px;
      border-radius: 5px;
      background: linear-gradient(to right, #0055ff, #00aaff, #ffffff, #ffaa00, #ff0000);
      border: 1px solid rgba(255,255,255,0.16);
      margin-top: 6px;
    }}

    .meta-box {{
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.10);
    }}

    .leaflet-control-layers {{
      font-family: monospace;
    }}
  </style>
</head>

<body>
  <div id="map"></div>

  <div class="luwa-panel">
    <h2>LUWA NO₂ surface comparison</h2>
    <p>LOTOS-EUROS conc-3d, variable <strong>{variable}</strong>, surface level <strong>{level_index}</strong>, time index <strong>{time_index}</strong>, date <strong>{date_label}</strong>. All layers use the same scale.</p>

    <label class="label" for="layer-select">Resolution layer</label>
    <select id="layer-select"></select>

    <div class="row">
      <span class="label">Cursor</span>
      <span class="value" id="coords">--</span>
    </div>

    <div class="row">
      <span class="label">NO₂ value</span>
      <span class="value" id="probe">--</span>
    </div>

    <div class="row">
      <span class="label">Current layer</span>
      <span class="value" id="current-layer">--</span>
    </div>

    <label class="label" for="opacity">Opacity</label>
    <input type="range" id="opacity" min="0" max="100" value="80">

    <div class="row">
      <span class="label">{vmin:.3f} {units}</span>
      <span class="label">Common scale</span>
      <span class="label">{vmax:.3f} {units}</span>
    </div>
    <div class="legend-bar"></div>

    <div class="meta-box">
      <div class="row">
        <span class="label">Units</span>
        <span class="value">{units}</span>
      </div>
      <div class="row">
        <span class="label">Scale</span>
        <span class="value">2nd–98th percentile</span>
      </div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <script>
    const layers = {layers_json};
    let activeOverlay = null;
    let activeLayer = null;

    const map = L.map("map", {{
      minZoom: 2,
      maxZoom: 12
    }}).setView([19.5, -99.1], 6);

    L.tileLayer("https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png", {{
      maxZoom: 12,
      attribution: "&copy; OpenStreetMap contributors"
    }}).addTo(map);

    const layerSelect = document.getElementById("layer-select");
    const currentLayerBox = document.getElementById("current-layer");
    const opacitySlider = document.getElementById("opacity");

    function setActiveLayer(layerName) {{
      const layer = layers[layerName];
      if (!layer) return;

      if (activeOverlay) {{
        map.removeLayer(activeOverlay);
      }}

      const bounds = [
        [layer.bounds.south, layer.bounds.west],
        [layer.bounds.north, layer.bounds.east]
      ];

      activeOverlay = L.imageOverlay(layer.image, bounds, {{
        opacity: Number(opacitySlider.value) / 100,
        interactive: false
      }}).addTo(map);

      activeLayer = layer;
      currentLayerBox.textContent = layerName;
      map.fitBounds(bounds);
    }}

    function nearestIndex(values, x) {{
      if (!values || values.length === 0) return -1;
      let best = 0;
      let bestDist = Math.abs(values[0] - x);
      for (let i = 1; i < values.length; i++) {{
        const dist = Math.abs(values[i] - x);
        if (dist < bestDist) {{
          best = i;
          bestDist = dist;
        }}
      }}
      return best;
    }}

    Object.keys(layers).forEach((name) => {{
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      layerSelect.appendChild(option);
    }});

    layerSelect.addEventListener("change", () => {{
      setActiveLayer(layerSelect.value);
    }});

    opacitySlider.addEventListener("input", () => {{
      if (activeOverlay) {{
        activeOverlay.setOpacity(Number(opacitySlider.value) / 100);
      }}
    }});

    map.on("mousemove", (event) => {{
      const lat = event.latlng.lat;
      const lon = event.latlng.lng;

      document.getElementById("coords").textContent =
        `Lat: ${{lat.toFixed(3)}} | Lon: ${{lon.toFixed(3)}}`;

      if (!activeLayer) {{
        document.getElementById("probe").textContent = "--";
        return;
      }}

      const b = activeLayer.bounds;

      if (lat < b.south || lat > b.north || lon < b.west || lon > b.east) {{
        document.getElementById("probe").textContent = "outside layer";
        return;
      }}

      const i = nearestIndex(activeLayer.lats, lat);
      const j = nearestIndex(activeLayer.lons, lon);

      if (i < 0 || j < 0) {{
        document.getElementById("probe").textContent = "--";
        return;
      }}

      const val = activeLayer.values[i][j];

      if (val === null || val === undefined || Number.isNaN(val)) {{
        document.getElementById("probe").textContent = "no data";
      }} else {{
        document.getElementById("probe").textContent = `${{Number(val).toFixed(3)}} {units}`;
      }}
    }});

    const firstLayer = Object.keys(layers)[0];
    if (firstLayer) {{
      layerSelect.value = firstLayer;
      setActiveLayer(firstLayer);
    }}
  </script>
</body>
</html>
"""

    output_html.write_text(html, encoding="utf-8")


def generate_preview_for_time(
    files: Dict[str, str],
    base_dir: Path,
    output_dir: Path,
    output_prefix: str,
    variable: str,
    time_index: int,
    level_index: int,
    max_points_axis: int,
    convert_to_ppb: bool,
    date_label: str,
) -> Path:
    raw = {}
    all_valid_values = []

    print(f"\n[INFO] Generating NO2 surface preview for time_index={time_index}, level_index={level_index}\n")

    for label, filename in files.items():
        nc_path = base_dir / filename
        print(f"[READ] {label}: {nc_path.name}")

        values, lats, lons, meta = select_no2_surface(
            nc_path=nc_path,
            variable=variable,
            time_index=time_index,
            level_index=level_index,
            max_points_axis=max_points_axis,
            convert_to_ppb=convert_to_ppb,
        )

        valid = values[np.isfinite(values)]
        if valid.size:
            all_valid_values.append(valid)

        raw[label] = {
            "values": values,
            "lats": lats,
            "lons": lons,
            "meta": meta,
        }

        print(f"  variable: {meta['variable']}")
        print(f"  dims: {meta['dims']}")
        print(f"  sizes: {meta['sizes']}")
        print(f"  selectors: {meta['selectors']}")
        print(f"  display units: {meta['units_display']} ({meta['conversion_note']})")
        print(f"  shape after selection: {meta['shape']}")
        print(
            f"  bounds: S={meta['lat_min']:.3f}, N={meta['lat_max']:.3f}, "
            f"W={meta['lon_min']:.3f}, E={meta['lon_max']:.3f}"
        )

        if "level_values_first" in meta:
            print(f"  first level values: {meta['level_values_first']}")

        if valid.size:
            print(
                f"  stats: min={np.nanmin(values):.4g}, "
                f"p50={np.nanpercentile(values, 50):.4g}, "
                f"p98={np.nanpercentile(values, 98):.4g}, "
                f"max={np.nanmax(values):.4g} {meta['units_display']}"
            )
        else:
            print("  stats: no valid values")

        print()

    if not all_valid_values:
        raise ProductError("No valid NO2 values found in any NetCDF file.")

    combined = np.concatenate(all_valid_values)
    vmin = float(np.nanpercentile(combined, 2))
    vmax = float(np.nanpercentile(combined, 98))

    if not np.isfinite(vmin) or not np.isfinite(vmax) or vmax <= vmin:
        vmin = float(np.nanmin(combined))
        vmax = float(np.nanmax(combined))

    units = next(iter(raw.values()))["meta"]["units_display"]

    layers = {}
    for label, item in raw.items():
        values = item["values"]
        lats = item["lats"]
        lons = item["lons"]
        meta = item["meta"]

        rgba = colorize(values, vmin, vmax)
        image_url = array_to_data_url(rgba)

        layers[label] = {
            "image": image_url,
            "values": values_for_json(values),
            "lats": [float(x) for x in lats],
            "lons": [float(x) for x in lons],
            "bounds": {
                "south": float(np.nanmin(lats)),
                "north": float(np.nanmax(lats)),
                "west": float(np.nanmin(lons)),
                "east": float(np.nanmax(lons)),
            },
            "metadata": meta,
        }

    output_dir.mkdir(parents=True, exist_ok=True)
    output_html = output_dir / f"{output_prefix}_t{time_index:02d}.html"

    build_html(
        layers=layers,
        output_html=output_html,
        title=f"LUWA NO2 surface comparison t{time_index:02d}",
        vmin=vmin,
        vmax=vmax,
        units=units,
        variable=variable,
        time_index=time_index,
        level_index=level_index,
        date_label=date_label,
    )

    print(f"[OK] HTML written: {output_html}")
    print(f"[OK] Common scale: {vmin:.4g} to {vmax:.4g} {units}")

    return output_html


def write_index(output_dir: Path, output_prefix: str, time_indices: List[int], date_label: str) -> Path:
    links = "\n".join(
        f'<li><a href="{output_prefix}_t{ti:02d}.html">NO₂ surface preview, time index {ti:02d}</a></li>'
        for ti in time_indices
    )
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LUWA NO2 preview index</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      margin: 0;
      padding: 32px;
      background: #0c0e12;
      color: #f3f4f6;
      font-family: monospace;
    }}
    a {{ color: #7ab7ff; }}
    li {{ margin: 10px 0; }}
  </style>
</head>
<body>
  <h1>LUWA NO₂ surface previews</h1>
  <p>Date: {date_label}. Variable: no2. Layer: surface level, level_index = 0.</p>
  <ul>
    {links}
  </ul>
</body>
</html>
"""
    output_file = output_dir / f"{output_prefix}_index.html"
    output_file.write_text(html, encoding="utf-8")
    return output_file


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Generate LUWA NO2 surface four-resolution HTML previews from LOTOS-EUROS NetCDF files."
    )
    parser.add_argument("--base-dir", default=".", help="Folder containing the four NetCDF files.")
    parser.add_argument("--output-dir", default=".", help="Folder where HTML previews will be written.")
    parser.add_argument("--output-prefix", default="luwa_no2_surface_20240703", help="Output HTML filename prefix.")
    parser.add_argument("--date", default="2024-07-03", help="Date label shown in the HTML product.")
    parser.add_argument("--variable", default="no2", help="Variable to read from NetCDF files.")
    parser.add_argument("--level-index", type=int, default=0, help="Vertical level index. Surface is expected to be 0.")
    parser.add_argument(
        "--time-indices",
        type=parse_time_indices,
        default=[0, 6, 12, 18],
        help="Comma-separated time indices to generate. Default: 0,6,12,18",
    )
    parser.add_argument(
        "--max-points-axis",
        type=int,
        default=360,
        help="Maximum grid points per axis embedded in the browser product.",
    )
    parser.add_argument(
        "--no-ppb",
        action="store_true",
        help="Keep original units instead of converting mole mole-1 to ppb.",
    )
    return parser


def main() -> int:
    parser = build_arg_parser()
    args = parser.parse_args()

    base_dir = Path(args.base_dir).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()

    print("\n[LUWA] NO2 surface four-resolution preview generator")
    print(f"[LUWA] base_dir: {base_dir}")
    print(f"[LUWA] output_dir: {output_dir}")
    print(f"[LUWA] time_indices: {args.time_indices}")
    print(f"[LUWA] level_index: {args.level_index}\n")

    missing = [filename for filename in DEFAULT_FILES.values() if not (base_dir / filename).exists()]
    if missing:
        print("[ERROR] Missing required NetCDF files:", file=sys.stderr)
        for filename in missing:
            print(f"  - {base_dir / filename}", file=sys.stderr)
        return 2

    generated = []
    try:
        for time_index in args.time_indices:
            html = generate_preview_for_time(
                files=DEFAULT_FILES,
                base_dir=base_dir,
                output_dir=output_dir,
                output_prefix=args.output_prefix,
                variable=args.variable,
                time_index=time_index,
                level_index=args.level_index,
                max_points_axis=args.max_points_axis,
                convert_to_ppb=not args.no_ppb,
                date_label=args.date,
            )
            generated.append(html)

        index_file = write_index(
            output_dir=output_dir,
            output_prefix=args.output_prefix,
            time_indices=args.time_indices,
            date_label=args.date,
        )
        generated.append(index_file)

    except Exception as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 1

    print("\n[LUWA] Generated files:")
    for path in generated:
        print(f"  - {path}")

    print("\n[LUWA] Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
