# ===========================================================
# GHANA PROMISE GUARDIAN - One-Click Update Script
# Author: Rauf Husein
# Description: Push updates to GitHub + Expo EAS (and build)
# ===========================================================

# 1️⃣ Navigate to project directory
Set-Location "C:\Users\Admin\Desktop\GHANA B-D\GhanaPromiseGuardian"

Write-Host "🚀 Starting update process..." -ForegroundColor Cyan

# 2️⃣ Add and commit latest changes to GitHub
git add .
$commitMessage = Read-Host "Enter commit message (e.g. 'UI Update or Bug Fix')"
git commit -m "$commitMessage"
git push origin main

Write-Host "✅ Changes pushed to GitHub." -ForegroundColor Green

# 3️⃣ Log in to Expo (if not already logged in)
Write-Host "🔐 Checking Expo authentication..." -ForegroundColor Yellow

npx expo whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please log in to Expo:"
    npx expo login
}

# 4️⃣ Publish update to Expo EAS
Write-Host "📦 Publishing update to Expo EAS (production channel)..." -ForegroundColor Cyan
npx eas update --branch production --message "$commitMessage"

Write-Host "✅ Update published successfully to Expo EAS!" -ForegroundColor Green

# 5️⃣ Ask user if they want to build a new APK/AAB
$buildChoice = Read-Host "Do you want to build a new Android .aab file? (yes/no)"
if ($buildChoice -eq "yes") {
    Write-Host "🏗️ Building new Android app..." -ForegroundColor Yellow
    npx eas build --platform android --profile production
    Write-Host "✅ Build completed! Check Expo dashboard for download link." -ForegroundColor Green
} else {
    Write-Host "⏭️ Skipping build step." -ForegroundColor Yellow
}

Write-Host "🎉 All done! App synced with GitHub and Expo." -ForegroundColor Cyan
# ===========================================================
