Add-Type -AssemblyName System.Drawing

function New-Pt([double]$x, [double]$y, [double]$scale) {
    return [System.Drawing.PointF]::new([float]($x * $scale), [float]($y * $scale))
}

function Draw-IconBitmap([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $scale = [double]$size / 512.0

    # Draw rounded squircle
    $radius = [float](116.0 * $scale)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = [float]($radius * 2.0)
    $sF = [float]$size
    $path.AddArc(0.0, 0.0, $d, $d, 180, 90)
    $path.AddArc($sF - $d, 0.0, $d, $d, 270, 90)
    $path.AddArc($sF - $d, $sF - $d, $d, $d, 0, 90)
    $path.AddArc(0.0, $sF - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    # Blue gradient background: #3b82f6 -> #1d4ed8
    $cTop = [System.Drawing.Color]::FromArgb(255, 59, 130, 246)
    $cBot = [System.Drawing.Color]::FromArgb(255, 29, 78, 216)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.PointF]::new(0, 0),
        [System.Drawing.PointF]::new(0, $sF),
        $cTop,
        $cBot
    )
    $g.FillPath($bgBrush, $path)

    # Subtle inner rim
    $rimWidth = [float]([Math]::Max(1.0, 3.0 * $scale))
    $rimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(50, 255, 255, 255), $rimWidth)
    $g.DrawPath($rimPen, $path)

    # Bottom chevron
    $botWidth = [float]([Math]::Max(1.5, 26.0 * $scale))
    $penBot = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 255, 255, 255), $botWidth)
    $penBot.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penBot.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penBot.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $ptsBot = [System.Drawing.PointF[]]@(
        (New-Pt 116 356 $scale),
        (New-Pt 256 430 $scale),
        (New-Pt 396 356 $scale)
    )
    $g.DrawLines($penBot, $ptsBot)

    # Middle chevron
    $midWidth = [float]([Math]::Max(1.5, 26.0 * $scale))
    $penMid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 255, 255, 255), $midWidth)
    $penMid.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penMid.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penMid.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $ptsMid = [System.Drawing.PointF[]]@(
        (New-Pt 116 276 $scale),
        (New-Pt 256 350 $scale),
        (New-Pt 396 276 $scale)
    )
    $g.DrawLines($penMid, $ptsMid)

    # Top diamond surface shadow
    if ($size -ge 32) {
        $shadowWidth = [float]([Math]::Max(2.0, 14.0 * $scale))
        $shadowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(50, 15, 23, 42), $shadowWidth)
        $shadowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
        $ptsShadow = [System.Drawing.PointF[]]@(
            (New-Pt 256 122 $scale),
            (New-Pt 396 196 $scale),
            (New-Pt 256 270 $scale),
            (New-Pt 116 196 $scale)
        )
        $g.DrawPolygon($shadowPen, $ptsShadow)
    }

    # Top diamond surface fill
    $topBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 255, 255, 255))
    $ptsTop = [System.Drawing.PointF[]]@(
        (New-Pt 256 116 $scale),
        (New-Pt 396 190 $scale),
        (New-Pt 256 264 $scale),
        (New-Pt 116 190 $scale)
    )
    $g.FillPolygon($topBrush, $ptsTop)
    $topWidth = [float]([Math]::Max(1.5, 12.0 * $scale))
    $topPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $topWidth)
    $topPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $g.DrawPolygon($topPen, $ptsTop)

    # Inset bit tool socket if size >= 32
    if ($size -ge 32) {
        $bitWidth = [float]([Math]::Max(1.0, 7.0 * $scale))
        $bitPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 37, 99, 235), $bitWidth)
        $bitPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
        $bitBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 37, 99, 235))
        $ptsBit = [System.Drawing.PointF[]]@(
            (New-Pt 256 156 $scale),
            (New-Pt 312 190 $scale),
            (New-Pt 256 224 $scale),
            (New-Pt 200 190 $scale)
        )
        $g.FillPolygon($bitBrush, $ptsBit)
        $g.DrawPolygon($bitPen, $ptsBit)

        $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 37, 99, 235))
        $dotR = [float]([Math]::Max(1.5, 10.0 * $scale))
        $g.FillEllipse($dotBrush, [float](256.0 * $scale - $dotR), [float](190.0 * $scale - $dotR), [float]($dotR * 2.0), [float]($dotR * 2.0))
    }

    $g.Dispose()
    return $bmp
}

function Create-IcoFile([System.Drawing.Bitmap[]]$bitmaps, [string]$outputPath) {
    $ms = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter($ms)

    # ICONDIR
    $bw.Write([uint16]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]$bitmaps.Length)

    $pngBuffers = @()
    foreach ($bmp in $bitmaps) {
        $imgMs = New-Object System.IO.MemoryStream
        $bmp.Save($imgMs, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngBuffers += ,$imgMs.ToArray()
        $imgMs.Dispose()
    }

    $offset = 6 + (16 * $bitmaps.Length)

    for ($i = 0; $i -lt $bitmaps.Length; $i++) {
        $bmp = $bitmaps[$i]
        $bytes = $pngBuffers[$i]
        $w = if ($bmp.Width -ge 256) { 0 } else { [byte]$bmp.Width }
        $h = if ($bmp.Height -ge 256) { 0 } else { [byte]$bmp.Height }

        $bw.Write($w)
        $bw.Write($h)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([uint16]1)
        $bw.Write([uint16]32)
        $bw.Write([uint32]$bytes.Length)
        $bw.Write([uint32]$offset)

        $offset += $bytes.Length
    }

    foreach ($bytes in $pngBuffers) {
        $bw.Write($bytes)
    }

    $bw.Flush()
    [System.IO.File]::WriteAllBytes($outputPath, $ms.ToArray())
    $bw.Dispose()
    $ms.Dispose()
}

Write-Output "Generating PNG & ICO favicons..."

$bmp16 = Draw-IconBitmap 16
$bmp32 = Draw-IconBitmap 32
$bmp48 = Draw-IconBitmap 48
$bmp180 = Draw-IconBitmap 180
$bmp192 = Draw-IconBitmap 192
$bmp512 = Draw-IconBitmap 512

# Save PNGs
$bmp180.Save("D:\personal\Toolora\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp180.Save("D:\personal\Toolora\src\app\apple-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp192.Save("D:\personal\Toolora\public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Save("D:\personal\Toolora\public\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Save ICOs with 16, 32, 48
$icoList = [System.Drawing.Bitmap[]]@($bmp16, $bmp32, $bmp48)
Create-IcoFile $icoList "D:\personal\Toolora\public\favicon.ico"
Create-IcoFile $icoList "D:\personal\Toolora\src\app\favicon.ico"

Write-Output "All favicons generated successfully!"
