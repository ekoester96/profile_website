# Ethan Koester - Portfolio Website

A personal portfolio website showcasing my professional background, education, projects, and work experience.

## Overview

This is a static website built with HTML, CSS, and JavaScript featuring a terminal-inspired design. The site includes pages for my professional bio, education history, work experience, project showcase, and GitHub activity.

## Pages

- **index.html** - Landing page
- **about.html** - Personal bio and background
- **education.html** - Academic history
- **work.html** - Professional experience
- **projects.html** - Project showcase
- **github.html** - GitHub activity and contributions
- **secret.html** - Easter egg page

## Tech Stack

- HTML5
- CSS3
- JavaScript (terminal.js for interactive terminal UI)

## Infrastructure

This site is hosted on a self-managed Ubuntu Server 24.04 VM running in a Proxmox DMZ environment. The deployment stack includes:

- **Nginx** (Docker) serving static files with self-signed TLS
- **Cloudflare Tunnel** for public HTTPS access at [ekoester.org](https://ekoester.org)
- **GitHub Actions** with a self-hosted runner for automatic deployment on push to `main`

## Deployment

Pushing to `main` triggers an automatic deployment via a self-hosted GitHub Actions runner. The workflow pulls the latest code and restarts the Nginx container.

## Local Development

Clone the repository and open `index.html` in a browser — no build step required.

```bash
