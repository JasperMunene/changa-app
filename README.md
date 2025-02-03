# Crowdfunding Platform

A full-stack crowdfunding platform that allows users to create, contribute to, and view campaigns. The backend is built using Flask, and the frontend is developed with Next.js.

## Features

- Create a crowdfunding campaign
- Contribute to existing campaigns
- View ongoing and completed campaigns

## Tech Stack

- **Frontend:** Next.js
- **Backend:** Flask
- **Database:** (SQLite)
- **Authentication:** (Clerk auth)

## Installation

### Backend Setup (Flask)

1. Clone the repository:
   ```sh
   git clone https://github.com/JasperMunene/changa-app.git
   cd changa-app/server
   ```

2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```sh
   flask run
   ```

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```sh
   cd changa-app/client
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Copy `.envexample.txt` and rename it to `.env.local`
   - Add the required API keys

4. Run the Next.js app:
   ```sh
   npm run dev
   ```

## Usage

- Navigate to `http://localhost:3000` to access the web app.
- Create an account and log in.
- Start a campaign or contribute to an existing one.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Submit a pull request.

## Author

**Jasper Munene**  
Creator & Developer of the changa-app

- GitHub: [@JasperMunene](https://github.com/JasperMunene)
- Email: [devjaspermunene@gmail.com](mailto:devjaspermunene@gmail.com)

Feel free to reach out if you have any questions or suggestions!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


