#!/bin/sh

#Project dependencies file
#Final authority on what's required to fully build the project

# byond version. Also must be updated in .tgs.yml
export BYOND_MAJOR=516
export BYOND_MINOR=1685

#rust_g git tag
export RUST_G_VERSION=7.0.0

# Bun version
export BUN_VERSION=1.3.5

# SpacemanDMM git tag
export SPACEMAN_DMM_VERSION=suite-1.11

# Python version for mapmerge and other tools
export PYTHON_VERSION=3.11.0

#dreamluau repo
export DREAMLUAU_REPO="tgstation/dreamluau"

#dreamluau git tag
export DREAMLUAU_VERSION=0.1.2

#hypnagogic repo
export CUTTER_REPO=spacestation13/hypnagogic

#hypnagogic git tag
export CUTTER_VERSION=v5.0.1


#Local TTS server (.TTS, optional, Windows)
#Rust toolchain: winget install Rustlang.Rustup
export TTS_RUST_TOOLCHAIN=stable
#Visual Studio Build Tools 2022 with C++ workload
#CMake, LLVM (set LIBCLANG_PATH=C:\Program Files\LLVM\bin), FFmpeg in PATH
export TTS_PIPER_RS_VERSION=0.2.0
