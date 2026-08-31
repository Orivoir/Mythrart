# Upload strategy

Files are uploaded directly from the client to S3. The API coordinates
handshake creation, validation, move, and reference creation, but does not
stream file bytes.

## Routes layout

Upload routes are organized under `/api/uploads`:

- `POST /api/uploads/presigned-url`
- `POST /api/uploads/complete`
- `PUT /api/uploads/reference/cover-image/:id`

Legacy endpoints may delegate to these handlers during migration.

## Step 1: request a presigned URL

`POST /api/uploads/presigned-url`

Request body:

```json
{
  "fileName": "<string>",
  "mimeType": "<string>",
  "context": "<AssetReferenceType>",
  "size": "<number in bytes>"
}
```

The endpoint validates auth and business rules (quota/plan checks are TODO),
creates an `UploadHandshake`, and then generates a presigned URL bound to the
temporary S3 key stored in that handshake.

Response body:

```json
{
  "uploadHandshakeId": "<string>",
  "uploadUrl": "<presigned url>",
  "expiresIn": 3600
}
```

## Step 2: upload to S3

The client uploads bytes directly to `uploadUrl`:

```ts
const uploadResponse = await fetch(body.uploadUrl, {
  method: "PUT",
  headers: {
    "content-type": "image/png",
  },
  body: uploadPayload,
});
```

Objects are uploaded to temporary keys using `S3_TEMP_UPLOAD_PREFIX`.

## Step 3: complete upload

`POST /api/uploads/complete`

Request body:

```json
{
  "uploadHandshakeId": "<string>"
}
```

This endpoint loads the `UploadHandshake`, reads the object metadata from S3
with `HeadObject`, verifies the temporary key, MIME type, and size against the
server-stored expectations, moves the object from the temporary path to its
permanent path, and creates the uploaded `Asset` record.

## Step 4: create resource reference

For cover images:

- `PUT /api/uploads/reference/cover-image/:id`

This endpoint attaches the already-created uploaded asset to the ebook.

## Security notes

Bucket policy should enforce global constraints (max object size, allowed MIME
families). App endpoints enforce user-specific rules (plan/quota/ownership).

No bucket configuration changes are required in this refactor.
