# Boleto Mailer

This is a simple concept application to email boletos. A boleto is an invoice payment method commonly used in Brazil. 

The app uses [Ethereal](https://ethereal.email/) for testing purposes to simulate sending emails.

It accepts a CSV file with the following columns:

- name → name
- governmentId → document number  
- email → payee email
- debtAmount → amount
- debtDueDate → Date to be paid 
- debtID → uuid for the debt

## Stack

- [Bun](https://bun.sh/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)


### Prerequisites

You need to install bun

* To install bun, run this command:
  ```sh
  curl -fsSL https://bun.sh/install | bash
  ```
  _Supported on macOS, Linux, and WSL_

### Installation

1. Install the packages
   ```sh
   bun install
   ```

3. With packages installed, run development command:
    ```sh
    bun run dev
    ```

The API will be available on http://localhost:8888 and the backend on http://localhost:8889.


### Issues / TODO
- [ ] Bun is not reading the.env file, need to debug and check if there is an issue in this version.
- [ ] Server responses with status 400 are not sending the custom error message, only "Bad Request".