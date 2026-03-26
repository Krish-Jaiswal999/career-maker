# Password Reset Feature - Documentation

## Overview
The password reset feature allows users to securely reset their password using a One-Time Password (OTP) sent to their registered email address. This feature uses a 3-step verification process for maximum security.

## Features

✅ **Secure OTP-based reset** - 6-digit one-time password
✅ **Email verification** - OTP sent to registered email
✅ **Time-limited OTP** - Expires after 10 minutes
✅ **Attempt throttling** - Maximum 3 failed OTP attempts
✅ **Confirmation email** - User receives confirmation of password change
✅ **Client-side validation** - Real-time password requirements checking
✅ **Responsive UI** - Multi-step wizard with visual progress indicator

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file in the backend directory:

```env
# Email Configuration (for password reset OTP)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
```

**For Gmail Users:**
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated 16-character password as `SENDER_PASSWORD`

**For Other Email Providers:**
- **Outlook/Hotmail**: SMTP server: `smtp-mail.outlook.com`, Port: `587`
- **SendGrid**: `smtp.sendgrid.net`, Port: `587` (use `apikey` as username)
- **AWS SES**: Verify email first, use SMTP credentials from AWS console

### 2. Database Migration

The `User` model has been updated with three new fields for OTP management:
- `reset_otp` (String, nullable) - Stores the generated OTP
- `otp_expiry` (DateTime, nullable) - Stores OTP expiration time
- `otp_attempts` (Integer, default=0) - Tracks failed verification attempts

**If using an existing database**, run migration:
```sql
ALTER TABLE users ADD COLUMN reset_otp VARCHAR(10) NULL;
ALTER TABLE users ADD COLUMN otp_expiry TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN otp_attempts INTEGER DEFAULT 0;
```

### 3. Verify Backend is Running

Ensure your backend server is running:
```bash
cd backend
python -m uvicorn app.main:app --reload
```

## User Flow

### Step 1: Request Password Reset
1. User clicks "Forgot Password?" link on login page
2. User enters their email address
3. Backend generates a 6-digit OTP
4. OTP is sent to user's email
5. UI transitions to Step 2

### Step 2: Verify OTP
1. User enters the 6-digit code from their email
2. Backend validates the OTP:
   - Must match the stored OTP
   - Must not be expired (10-minute window)
   - User must not have exceeded 3 failed attempts
3. Upon success, UI transitions to Step 3
4. Failed attempts increment counter and show error messages

### Step 3: Reset Password
1. User enters new password and confirms it
2. Frontend validates:
   - Minimum 6 characters
   - Passwords match
3. Backend validates and:
   - Updates password hash
   - Clears OTP and expiry
   - Sends confirmation email
4. User is redirected to login page

## API Endpoints

### POST /api/auth/forgot-password
**Request a password reset OTP**

```bash
curl -X POST "http://localhost:8000/api/auth/forgot-password?email=user@example.com" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "message": "If email exists, OTP has been sent"
}
```

**Security Note:** Always returns same message regardless of whether email exists (prevents email enumeration)

---

### POST /api/auth/verify-otp
**Verify the OTP sent to user's email**

```bash
curl -X POST "http://localhost:8000/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

**Response (Success):**
```json
{
  "message": "OTP verified successfully",
  "verified": true
}
```

**Error Responses:**
- `400` - Invalid OTP or OTP expired
- `429` - Too many failed attempts (3+ tries)
- `404` - User not found

---

### POST /api/auth/reset-password
**Reset password using verified OTP**

```bash
curl -X POST "http://localhost:8000/api/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "NewPassword123"
  }'
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

**Validation:**
- Password must be at least 6 characters
- OTP must be valid
- OTP must not be expired

## Files Modified/Created

### Backend
- **app/email_service.py** (NEW) - Email service for sending OTP and confirmations
- **app/auth/auth_service.py** - Added OTP generation and verification methods
- **app/api/auth_routes.py** - Added 3 new password reset endpoints
- **app/database/models.py** - Added OTP fields to User model
- **.env.example** - Added email configuration variables

### Frontend
- **pages/forgot-password.html** (NEW) - Multi-step password reset form
- **pages/login.html** - Added "Forgot Password?" link
- **css/styles.css** - Auth page styling (inherited)

## Development Mode

If you don't have email configured (no SMTP credentials), the system will:
1. Print OTP to server console instead of sending email
2. Allow password reset flow to complete
3. Skip email sending with no errors

This allows development/testing without email setup.

## Security Considerations

1. **OTP Expiration** - 10 minute window prevents brute force attacks
2. **Attempt Limiting** - Maximum 3 failed OTP attempts
3. **Email Verification** - User must have access to registered email
4. **No Email Enumeration** - Same response whether email exists or not
5. **Password Hashing** - New password uses same SHA256 + bcrypt hashing
6. **Confirmation Email** - User is notified of successful password change

## Testing

### Manual Testing Checklist

- [ ] User can navigate to forgot password page
- [ ] OTP is sent to valid email address
- [ ] Invalid OTP shows error message
- [ ] Expired OTP shows appropriate error
- [ ] Successful OTP verification transitions to password reset step
- [ ] Password requirements are validated
- [ ] Mismatched passwords show error
- [ ] Successful reset shows confirmation and redirects to login
- [ ] User can login with new password

### Testing Without Email (Dev Mode)

1. Don't set `SENDER_EMAIL` and `SENDER_PASSWORD` in `.env`
2. Check backend console for printed OTP
3. Enter the OTP from console in frontend

Example console output:
```
[DEV MODE] OTP for user@example.com: 123456
```

## Troubleshooting

### Email not being sent

**Check:**
1. `SMTP_SERVER`, `SMTP_PORT`, `SENDER_EMAIL`, `SENDER_PASSWORD` are set in `.env`
2. For Gmail: Using App Password, not regular password
3. Backend logs for specific SMTP errors
4. Firewall/network allows outbound SMTP connections

**Solution:** Check backend console for detailed error messages

---

### OTP keeps expiring before user can enter it

**Default:** 10-minute window
**Adjustment:** Edit `backend/app/api/auth_routes.py` and change:
```python
user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)  # Change 10 to desired minutes
```

---

### User locked out after 3 failed OTP attempts

**Current Behavior:** User must request a new OTP

**To Reset:** User can request new OTP, which clears attempt counter

---

### Password reset endpoint returns 401

**Cause:** Invalid or expired OTP
**Solution:** Verify OTP hasn't expired, user provided correct OTP

## Future Enhancements

- [ ] Resend OTP button (with rate limiting)
- [ ] SMS-based OTP option
- [ ] Password strength requirements
- [ ] Two-factor authentication integration
- [ ] Password history (prevent reusing old passwords)
- [ ] Admin password reset capability
- [ ] Suspicious activity notifications
- [ ] Session invalidation on reset

## Support

For issues or questions about the password reset feature, please refer to the main README or contact the development team.
