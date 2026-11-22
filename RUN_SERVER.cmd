@echo off
setlocal enableextensions
title Game Server
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
echo.
echo   %CY%╭──────────────────────────────────────────────────────────╮%R%
echo   %CY%│%R%  %B%OUTER RIM 13%R%  %D%game server%R%                               %CY%│%R%
echo   %CY%╰──────────────────────────────────────────────────────────╯%R%
echo.
if not exist "%~dp0.TTS\RUN_TTS.cmd" (
  echo   %D%TTS      not installed ^(no .TTS folder^)%R%
  goto game
)
findstr /b /i /c:"enabled = true" "%TTS_CONFIG%" >nul 2>nul
if errorlevel 1 (
  echo   %D%TTS      off in config\tts.toml%R%
  goto game
)
if exist "%~dp0.TTS\ready" del "%~dp0.TTS\ready"
start "Text-To-Speech Server" cmd /c "%~dp0.TTS\RUN_TTS.cmd"
echo   %Y%TTS      starting, waiting for Text-To-Speech...%R%
set /a waited=0
:wait
if exist "%~dp0.TTS\ready" goto up
if %waited% geq 180 goto late
timeout /t 1 /nobreak >nul
set /a waited+=1
goto wait
:up
echo   %G%TTS      Text-To-Speech is UP! %D%^(%waited% s^)%R%
goto game
:late
echo   %RD%TTS      did not report ready in 180 s, starting the game server anyway%R%
:game
echo.
call "%~dp0tools\build\build.bat" --wait-on-error server %*
