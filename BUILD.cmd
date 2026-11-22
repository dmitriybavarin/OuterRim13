@echo off
setlocal enableextensions
call "%~dp0tools\build\build.bat" --wait-on-error build %*
set "GAME_BUILD=%errorlevel%"
if not exist "%~dp0.TTS\BUILD.cmd" exit /b %GAME_BUILD%
chcp 65001 >nul
for /f %%a in ('echo prompt $E^| cmd') do set "ESC=%%a"
set "R=%ESC%[0m"
set "B=%ESC%[1m"
set "D=%ESC%[2m"
set "G=%ESC%[32m"
set "Y=%ESC%[33m"
set "RD=%ESC%[31m"
set "CY=%ESC%[36m"
if not defined TTS_CONFIG set "TTS_CONFIG=%~dp0config\tts.toml"
findstr /b /i /c:"enabled = true" "%TTS_CONFIG%" >nul 2>nul
if errorlevel 1 (
  echo.
  echo   %D%TTS      off in config\tts.toml, build skipped%R%
  exit /b %GAME_BUILD%
)
call "%~dp0.TTS\BUILD.cmd"
if errorlevel 1 (
  echo   %RD%TTS      build failed%R%
  exit /b 1
)
exit /b %GAME_BUILD%
