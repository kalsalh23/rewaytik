try {
  $r = Invoke-WebRequest 'http://localhost:5000/swagger' -TimeoutSec 5 -UseBasicParsing
  Write-Output "Swagger status: $($r.StatusCode)"
  
  $loginBody = '{"email":"kosaialasalh1@gmail.com","password":"oday2001#"}'
  $r2 = Invoke-WebRequest 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody -TimeoutSec 5 -UseBasicParsing
  Write-Output "Login status: $($r2.StatusCode)"
  Write-Output "Login response: $($r2.Content)"
} catch {
  Write-Output "Error: $($_.Exception.Message)"
}
