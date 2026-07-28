try {
  $loginBody = '{"email":"kosaialasalh1@gmail.com","password":"oday2001#"}'
  $r2 = Invoke-WebRequest 'https://localhost:5001/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody -TimeoutSec 10 -UseBasicParsing
  Write-Output "Login status: $($r2.StatusCode)"
  Write-Output "Login response: $($r2.Content)"
} catch {
  Write-Output "Error: $($_.Exception.Message)"
}
