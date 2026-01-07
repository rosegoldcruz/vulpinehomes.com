# AEON Visualizer Python API

Python backend for the Vulpine Kitchen Visualizer with Universal Prompt Generation.

## Features

- **Universal Prompt Generator**: Dynamically builds Nano-Banana-compatible prompts
- **Image Analysis**: Uses BLIP-2 vision model to detect kitchen features
- **Full Pipeline**: Upload → Analyze → Generate Prompt → Transform → Return

## Installation

```bash
cd python-api
pip install -r requirements.txt
```

## Environment Variables

```bash
export REPLICATE_API_TOKEN="your_replicate_token"
```

## Running the API

```bash
uvicorn api:app --reload --port 8000
```

## API Endpoints

### `GET /`
Health check and endpoint list.

### `POST /prompt/generate`
Generate a prompt without running visualization.

```json
{
  "image_description": "L-shaped kitchen with oak cabinets",
  "door_style": "shaker",
  "color_hex": "#FFFFFF",
  "color_name": "Classic White",
  "hardware_style": "loft",
  "hardware_finish": "satinnickel"
}
```

### `POST /analyze`
Analyze a kitchen image using BLIP-2.

```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "image_url=https://example.com/kitchen.jpg"
```

### `POST /visualize`
Full visualization pipeline with image URL.

```json
{
  "image_url": "https://example.com/kitchen.jpg",
  "door_style": "shaker",
  "color_hex": "#FFFFFF",
  "color_name": "Classic White",
  "hardware_style": "loft",
  "hardware_finish": "satinnickel",
  "name": "John Doe",
  "phone": "555-123-4567"
}
```

### `POST /visualize/upload`
Upload image directly and run visualization.

```bash
curl -X POST "http://localhost:8000/visualize/upload" \
  -F "image=@kitchen.jpg" \
  -F "door_style=shaker" \
  -F "color_hex=#FFFFFF" \
  -F "color_name=Classic White" \
  -F "hardware_style=loft" \
  -F "hardware_finish=satinnickel" \
  -F "name=John Doe" \
  -F "phone=555-123-4567"
```

## Prompt Generator Options

### Door Styles
- `slab` - Flat smooth rectangles
- `shaker` - Recessed rectangular center panel
- `shaker-slide` - Horizontal recessed lines
- `fusion-shaker` - Modern thin frame
- `fusion-slide` - Clean rectangular recessed panel

### Hardware Styles
- `loft` - Straight bar pull with squared posts
- `bar` - Cylindrical bar handle
- `arch` - Soft curved arch handle
- `artisan` - Decorative detailing
- `cottage` - Classic rounded design
- `square` - Clean geometric lines

### Hardware Finishes
- `satinnickel` - Satin nickel brushed
- `chrome` - Polished chrome
- `black` - Matte black
- `rose_gold` - Warm rose gold
- `gold` - Polished gold
- `bronze` - Oil-rubbed bronze

## Architecture

```
┌─────────────────┐
│  Kitchen Photo  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   BLIP-2 Vision │  ← Analyzes: arches, lighting, angle, missing drawers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AEON Prompt    │  ← Builds 10-step chain-of-command
│   Generator     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Nano-Banana    │  ← Executes transformation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Refaced Image  │
└─────────────────┘
```

## License

Proprietary - Vulpine Home Pros
