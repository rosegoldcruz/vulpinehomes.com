# Add file path comments to all TypeScript/JavaScript files
# File: add-file-paths.ps1

$baseDir = "c:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com"
$extensions = @("*.ts", "*.tsx", "*.js", "*.jsx")
$excludeDirs = @("node_modules", ".next", "dist", "build", ".git")

function Add-FilePathComment {
    param([string]$filePath)
    
    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return }
    
    # Check if file already has the path comment
    $firstLine = ($content -split "`n")[0].TrimStart()
    if ($firstLine -match "^//\s*File:\s*") {
        Write-Host "Skipping (already has path): $filePath" -ForegroundColor Yellow
        return
    }
    
    # Determine comment style based on file extension
    $ext = [System.IO.Path]::GetExtension($filePath)
    $pathComment = "// File: $filePath"
    
    # Add path comment at the top
    $newContent = "$pathComment`n$content"
    
    # Write back to file
    Set-Content -Path $filePath -Value $newContent -NoNewline
    Write-Host "Added path to: $filePath" -ForegroundColor Green
}

# Get all files
$files = @()
foreach ($ext in $extensions) {
    $found = Get-ChildItem -Path $baseDir -Filter $ext -Recurse -File | Where-Object {
        $path = $_.FullName
        $exclude = $false
        foreach ($dir in $excludeDirs) {
            if ($path -like "*\$dir\*") {
                $exclude = $true
                break
            }
        }
        -not $exclude
    }
    $files += $found
}

Write-Host "`nFound $($files.Count) files to process`n" -ForegroundColor Cyan

# Process each file
$processed = 0
foreach ($file in $files) {
    Add-FilePathComment -filePath $file.FullName
    $processed++
    
    # Progress indicator every 10 files
    if ($processed % 10 -eq 0) {
        Write-Host "`nProcessed $processed / $($files.Count) files...`n" -ForegroundColor Cyan
    }
}

Write-Host "`n✅ COMPLETE: Processed $processed files`n" -ForegroundColor Green
