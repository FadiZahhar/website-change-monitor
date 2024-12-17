# Website Change Monitor

## Purpose

The Website Change Monitor is a tool designed to monitor websites for changes. It periodically crawls specified websites, takes screenshots, compares them with previous versions, and generates reports highlighting any differences. This tool is useful for ensuring website integrity, detecting unauthorized changes, and maintaining a record of website updates.

## Features

- Crawls websites and captures screenshots.
- Compares current screenshots with previous versions.
- Generates detailed reports with differences highlighted.
- Sends email notifications with the report.
- Provides a web interface to monitor progress and view logs.

## Prerequisites

- Docker Desktop
- Git

## Installation

### Step 1: Install Docker Desktop

1. **Download Docker Desktop**:
   - Visit the [Docker Desktop download page](https://www.docker.com/products/docker-desktop) and download the installer for your operating system.

2. **Install Docker Desktop**:
   - Follow the installation instructions for your operating system:
     - **Windows**: Run the installer and follow the on-screen instructions.
     - **macOS**: Open the downloaded `.dmg` file and drag Docker to the Applications folder.
     - **Linux**: Follow the specific instructions for your distribution on the Docker website.

3. **Start Docker Desktop**:
   - Launch Docker Desktop and ensure it is running.

### Step 2: Clone the Repository

1. **Open a terminal**:
   - On Windows, you can use Command Prompt, PowerShell, or Git Bash.
   - On macOS and Linux, use the Terminal application.

2. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/website-change-monitor.git
   cd website-change-monitorSure, I'll fix the formatting issue in the 

Readme.md

 file.

```markdown
# Website Change Monitor

## Purpose

The Website Change Monitor is a tool designed to monitor websites for changes. It periodically crawls specified websites, takes screenshots, compares them with previous versions, and generates reports highlighting any differences. This tool is useful for ensuring website integrity, detecting unauthorized changes, and maintaining a record of website updates.

## Features

- Crawls websites and captures screenshots.
- Compares current screenshots with previous versions.
- Generates detailed reports with differences highlighted.
- Sends email notifications with the report.
- Provides a web interface to monitor progress and view logs.

## Prerequisites

- Docker Desktop
- Git

## Installation

### Step 1: Install Docker Desktop

1. **Download Docker Desktop**:
   - Visit the [Docker Desktop download page](https://www.docker.com/products/docker-desktop) and download the installer for your operating system.

2. **Install Docker Desktop**:
   - Follow the installation instructions for your operating system:
     - **Windows**: Run the installer and follow the on-screen instructions.
     - **macOS**: Open the downloaded `.dmg` file and drag Docker to the Applications folder.
     - **Linux**: Follow the specific instructions for your distribution on the Docker website.

3. **Start Docker Desktop**:
   - Launch Docker Desktop and ensure it is running.

### Step 2: Clone the Repository

1. **Open a terminal**:
   - On Windows, you can use Command Prompt, PowerShell, or Git Bash.
   - On macOS and Linux, use the Terminal application.

2. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/website-change-monitor.git
   cd website-change-monitor
   ```

### Step 3: Configure Environment Variables

1. **Create a `.env` file**:
   - In the root directory of the cloned repository, create a file named `.env`.

2. **Add the following environment variables**:
   ```env
   SMTP_PORT=587
   SMTP_HOST=smtp.domain.com
   EMAIL_USER=emailaddress
   EMAIL_PASS=emailpass
   NOTIFY_EMAIL=info@wmvp.dev
   ```

### Step 4: Build and Start the Application

1. **Build the Docker image**:
   ```sh
   ./build.sh
   ```

2. **Start the application**:
   ```sh
   ./start.sh
   ```

### Step 5: Stop the Application

1. **Stop the application**:
   ```sh
   ./stop.sh
   ```

## Usage

1. **Access the web interface**:
   - Open a web browser and navigate to `http://localhost:3000`.

2. **Start monitoring**:
   - Enter the URL of the website you want to monitor and click "Start Monitoring".

3. **View logs and progress**:
   - The web interface will display logs and progress of the monitoring process.

4. **Receive email reports**:
   - Once the monitoring is complete, an email report will be sent to the configured notification email address.

## How It Works

1. **Crawling**:
   - The tool uses Puppeteer to crawl the specified website, capturing all internal links and taking screenshots of each page.

2. **Comparison**:
   - Screenshots are compared using the `pixelmatch` library to detect any visual differences between the current and previous versions.

3. **Reporting**:
   - A report is generated summarizing the changes detected, including links to view the differences.

4. **Notification**:
   - The report is sent via email using Nodemailer, providing a detailed summary of the monitoring results.

## Troubleshooting

- Ensure Docker Desktop is running.
- Verify that the `.env` file contains the correct SMTP configuration.
- Check the logs in the web interface for any errors during the monitoring process.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.
