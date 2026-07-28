try {
  $loginBody = '{"email":"kosaialasalh1@gmail.com","password":"oday2001#"}'
  $r2 = Invoke-WebRequest 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody -TimeoutSec 10 -UseBasicParsing -MaximumRedirection 0
  $sc = $r2.StatusCode
  Write-Output "Status: $sc"
  if ($sc -eq 307) {
    Write-Output "Redirected to: $($r2.Headers.Location)"
    # Follow redirect manually with SkipCertificateCheck
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
    $r3 = Invoke-WebRequest $r2.Headers.Location -Method POST -ContentType 'application/json' -Body $loginBody -TimeoutSec 10 -UseBasicParsing
    Write-Output "Final status: $($r3.StatusCode)"
    Write-Output "Response: $($r3.Content)"
  } else {
    Write-Output "Response: $($r2.Content)"
  }
} catch {
  Write-Output "Error: $($_.Exception.Message)"
}
