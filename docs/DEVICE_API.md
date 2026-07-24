# Device API

The hardware scanners will communicate over HTTPS REST to the Node.js API.

### `POST /api/v1/device/scans`

Headers:
- `X-Device-ID`: UUID
- `X-Device-Key`: Secret Hash

Payload:
```json
{
  "scan_type": "MASTER",
  "article_id": "UUID",
  "master_swatch_id": "UUID",
  "batch_id": null,
  "spectral": {
      "f1": 100,
      "f2": 150,
      ...
  },
  "sensor_temperature": 28.4,
  "firmware_version": "0.1",
  "captured_at": "ISO-8601"
}
```
