@echo off
python "%~dp0dmi_tool.py" %*
if not "%~1"=="" pause
