# Security

1. **Helmet**: Used for basic HTTP security headers.
2. **Device Authentication**: Uses `X-Device-ID` and `X-Device-Key` headers rather than trusting simple device codes. Keys are hashed (demo implementation uses clear hash match for demonstration).
3. **Frontend**: The frontend uses `token` in `localStorage` generated via mocked login route for V1 prototype.
4. **CORS**: Configured on backend.
