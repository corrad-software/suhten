@echo off
REM SSH tunnel: localhost:5433 -> Postgres on private host via bastion
REM Keep this window open while developing against PostgreSQL.
REM From Git Bash / MINGW64 use instead:
REM   ./scripts/ssh-tunnel-pgsql.sh
REM Or from cmd.exe / PowerShell (this file):
REM   scripts\ssh-tunnel-pgsql.bat
REM   cmd //c scripts\ssh-tunnel-pgsql.bat

set KEY=%USERPROFILE%\.ssh\bastion-key-st.pem
if not exist "%KEY%" (
  echo Copying bastion key with restricted ACL...
  if not exist "%USERPROFILE%\.ssh" mkdir "%USERPROFILE%\.ssh"
  copy /Y "C:\ST\bastion-key.pem" "%KEY%" >nul
  icacls "%KEY%" /inheritance:r >nul
  icacls "%KEY%" /grant:r "%USERNAME%:(R)" >nul
)

echo Forwarding 127.0.0.1:5433 to ip-10-103-32-100.ap-southeast-5.compute.internal:5432
echo via bastion 43.217.107.131 ...
ssh -i "%KEY%" -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=60 -N -L 5433:ip-10-103-32-100.ap-southeast-5.compute.internal:5432 ec2-user@43.217.107.131
