# Script to add premium footer to index.html
$indexPath = "index.html"
$footerPath = "footer-new.html"
$cssLine = '<link rel="stylesheet" href="css/footer-premium.css">'

# Read files with proper encoding
$indexContent = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$footerContent = [System.IO.File]::ReadAllText($footerPath, [System.Text.Encoding]::UTF8)

# Add CSS link before </head>
if ($indexContent -notmatch 'footer-premium.css') {
    $indexContent = $indexContent -replace '</head>', "    $cssLine`n</head>"
    Write-Host "✓ Added footer CSS link" -ForegroundColor Green
}

# Replace old footer with new one
# Pattern to match old footer (from <footer to </footer>)
$footerPattern = '(?s)<footer.*?</footer>'
if ($indexContent -match $footerPattern) {
    $indexContent = $indexContent -replace $footerPattern, $footerContent
    Write-Host "✓ Replaced old footer with new premium footer" -ForegroundColor Green
}
else {
    # If no footer found, add before </body>
    $indexContent = $indexContent -replace '</body>', "$footerContent`n</body>"
    Write-Host "✓ Added new premium footer before </body>" -ForegroundColor Green
}

# Save with UTF-8 encoding
[System.IO.File]::WriteAllText($indexPath, $indexContent, [System.Text.Encoding]::UTF8)
Write-Host "`n✅ Footer successfully updated in index.html!" -ForegroundColor Cyan
