# PowerShell script to report image sizes and dimensions in a project directory, grouped by folder/subfolder, sorted by size descending

# Function to format file size in human-readable form
function Format-FileSize {
    param ([uint64]$Bytes)
    $Units = "B", "KB", "MB", "GB", "TB"
    $Index = 0
    $Size = [double]$Bytes
    while ($Size -ge 1024 -and $Index -lt $Units.Length - 1) {
        $Size /= 1024
        $Index++
    }
    "{0:N2} {1}" -f $Size, $Units[$Index]
}

# Function to get image dimensions
function Get-ImageDimensions {
    param ([string]$Path)
    try {
        $Shell = New-Object -ComObject Shell.Application
        $Folder = $Shell.Namespace((Split-Path $Path))
        $File = $Folder.ParseName((Split-Path $Path -Leaf))
        $Width = $Folder.GetDetailsOf($File, 31)  # Width property
        $Height = $Folder.GetDetailsOf($File, 32) # Height property
        if ($Width -and $Height) {
            return "$Width x $Height"
        } else {
            return "N/A"
        }
    } catch {
        return "Error"
    }
}

# Main script
$ProjectRoot = Get-Location
Write-Host "Scanning project directory: $ProjectRoot"

# Supported image extensions
$ImageExtensions = @("*.png", "*.jpg", "*.jpeg", "*.gif", "*.bmp", "*.webp")
$ImageData = @()

# Collect image information
foreach ($Ext in $ImageExtensions) {
    Get-ChildItem -Path $ProjectRoot -Recurse -Include $Ext -File | ForEach-Object {
        $RelativePath = $_.FullName.Substring($ProjectRoot.Path.Length + 1)
        $FolderPath = Split-Path $RelativePath -Parent
        if (-not $FolderPath) { $FolderPath = "." } # Root directory case
        $FileSize = $_.Length
        $Dimensions = Get-ImageDimensions -Path $_.FullName
        $ImageData += [PSCustomObject]@{
            Folder     = $FolderPath
            Path       = $RelativePath
            Dimensions = $Dimensions
            Size       = Format-FileSize -Bytes $FileSize
            SizeBytes  = $FileSize
        }
    }
}

# Group by folder and sort by size descending within each group
$GroupedData = $ImageData | Group-Object -Property Folder | Sort-Object -Property Name

# Display results
if ($ImageData.Count -eq 0) {
    Write-Host "No images found in the project."
} else {
    Write-Host "`nImage Size Report (Grouped by Folder, Sorted by Size Descending):"
    foreach ($Group in $GroupedData) {
        Write-Host "`nFolder: $($Group.Name)"
        $SortedGroup = $Group.Group | Sort-Object -Property SizeBytes -Descending
        $SortedGroup | Format-Table -Property Path, Dimensions, Size -AutoSize
    }

    # Display summary
    $TotalImages = $ImageData.Count
    $TotalSize = ($ImageData | Measure-Object -Property SizeBytes -Sum).Sum
    Write-Host "`nSummary:"
    Write-Host "Total Images: $TotalImages"
    Write-Host "Total Size: $(Format-FileSize -Bytes $TotalSize)"
}