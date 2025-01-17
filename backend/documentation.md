# Gold Fractional Ownership API Documentation

## Base URL
```
https://starkmine.onrender.com/api
```

## Authentication
All API endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Create Auth Token
```http
POST /api/auth/
Content-Type: json
```

**Request body**
```json
{
    "walletAddress" : "0x0004456770000099990000000000000"
}
```

## Dealers API Endpoints

### Create Dealer (KYC Registration)
```http
POST /api/dealers/
Content-Type: multipart/form-data
Body: form-data
Keys:
- governmentId (File) -> select file
- proofOfAddress (File) -> select file
- certificateOfIncorporation (File) -> select file
- memorandumArticles (File) -> select file
- businessLicense (File) -> select file
- sourceOfFunds (File) -> select file
- bankStatements (File) -> select file
- proofOfGoldSource (File) -> select file
- legalName (Text) -> "Dealer Name"
- dateOfBirth (Text) -> "Dealer Name"
- legalName (Text) -> "Dealer Name"
- address (Text) -> "dealer@example.com"
[Add any other dealer fields your schema requires]
```

**Form Fields:**
- `legalName` (string, required): Legal name of the dealer
- `dateOfBirth` (date, required): Date of birth in YYYY-MM-DD format
- `address` (string, required): Physical address

**File Upload Fields:**
- `governmentId` (file, required): Government-issued ID document
- `proofOfAddress` (file, required): Address proof document
- `certificateOfIncorporation` (file, required): Company incorporation certificate
- `memorandumArticles` (file, optional): Memorandum and articles of association
- `businessLicense` (file, optional): Business license document
- `sourceOfFunds` (file, optional): Source of funds documentation
- `bankStatements` (file, optional): Recent bank statements
- `proofOfGoldSource` (file, optional): Documentation proving gold source

**Response Example:**
```json
{
  "_id": "60a12b5f9f83d42d8c0d1234",
  "legalName": "Gold Trading Corp",
  "status": "pending",
  "createdAt": "2024-01-09T10:30:00.000Z",
  // ... other dealer details
}
```

### List All Dealers
```http
GET /dealers
```

**Query Parameters:**
- `status` (optional): Filter by status (pending/approved/rejected)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of records per page

### Get Dealer by ID
```http
GET /dealers/:id
```

### Update Dealer
```http
PUT /dealers/:id
Content-Type: multipart/form-data
```

### Delete Dealer
```http
DELETE /dealers/:id
```

## Gold API Endpoints

### Register New Gold
```http
POST /gold
Content-Type: multipart/form-data
```

**Form Fields:**
- `weight` (number, required): Weight in grams
- `purity` (number, required): Purity percentage
- `serialNumber` (string, required): Unique serial number
- `description` (string, required): Gold description
- `title` (string, required): Title for the gold listing
- `royaltyFee` (number, required): Royalty fee percentage
- `presumedPrice` (number, required): Presumed price per unit
- `dealerWalletAddress` (string, required): Dealer's wallet address
- `dealerId` (string, required): Dealer's MongoDB ID

**File Upload Fields:**
- `assayReport` (file, required): Assay report document
- `certificateOfOrigin` (file, required): Certificate of origin
- `lastPurchaseInvoice` (file, required): Last purchase invoice
- `billOfSale` (file, required): Bill of sale document
- `shippingDoc` (file, required): Shipping documentation

**Response Example:**
```json
{
  "_id": "60b23c6e9f83d42d8c0d5678",
  "weight": 1000,
  "purity": 99.9,
  "status": "pending",
  "createdAt": "2024-01-09T11:30:00.000Z",
  // ... other gold details
}
```

### List All Gold
```http
GET /gold
```

**Query Parameters:**
- `status` (optional): Filter by status (pending/approved/minted/rejected)
- `dealerId` (optional): Filter by dealer
- `page` (optional): Page number
- `limit` (optional): Records per page

### Get Gold by ID
```http
GET /gold/:id
```

### Update Gold
```http
PUT /gold/:id
Content-Type: multipart/form-data
```

### Delete Gold
```http
DELETE /gold/:id
```

## Storage API Endpoints

### Create Storage Location
```http
POST /storage/locations
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Secure Vault A",
  "address": "123 Secure St, Vault City",
  "securityLevel": "high",
  "storageCapacity": 1000,
  "vaultDetails": {
    "vaultNumber": "VA001",
    "securityFeatures": ["24/7 Guard", "Biometric Access"]
  },
  "contactPerson": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@vault.com"
  }
}
```

### List Storage Locations
```http
GET /storage/locations
```

**Query Parameters:**
- `status` (optional): Filter by status (active/inactive/maintenance)
- `page` (optional): Page number
- `limit` (optional): Records per page

### Assign Gold to Storage
```http
POST /storage/gold-storage
Content-Type: multipart/form-data
```

**Form Fields:**
- `goldId` (string, required): Gold ID to be stored
- `storageLocationId` (string, required): Storage location ID
- `vaultNumber` (string, required): Specific vault number
- `insuranceDetails` (object, required):
  - `policyNumber` (string, required)
  - `provider` (string, required)
  - `coverageAmount` (number, required)
  - `expiryDate` (date, required)

**File Upload Fields:**
- `storageCertificate` (file, required): Storage certificate document

**Response Example:**
```json
{
  "_id": "60c34d7e9f83d42d8c0d9012",
  "goldId": "60b23c6e9f83d42d8c0d5678",
  "storageLocationId": "60d45e8f9f83d42d8c0d3456",
  "status": "stored",
  "dateStored": "2024-01-09T12:30:00.000Z",
  // ... other storage details
}
```

## Audit Trail API Endpoints

### Get Audit Trail
```http
GET /audit
```

**Query Parameters:**
- `entityType` (optional): Filter by entity type (dealer/gold/storage)
- `action` (optional): Filter by action (create/update/delete)
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `page` (optional): Page number
- `limit` (optional): Records per page

**Response Example:**
```json
{
  "records": [
    {
      "_id": "60e56f8e9f83d42d8c0d7890",
      "entityType": "gold",
      "entityId": "60b23c6e9f83d42d8c0d5678",
      "action": "create",
      "performedBy": "60a12b5f9f83d42d8c0d1234",
      "timestamp": "2024-01-09T13:30:00.000Z",
      // ... other audit details
    }
  ],
  "totalRecords": 150,
  "currentPage": 1,
  "totalPages": 15
}
```

## Error Responses

All endpoints follow the same error response format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {} // Optional additional error details
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for normal endpoints
- 20 requests per minute for file upload endpoints

## File Upload Limits
- Maximum file size: 10MB per file
- Supported formats: PDF, JPG, PNG, DOCX
- Maximum concurrent uploads: 5 files