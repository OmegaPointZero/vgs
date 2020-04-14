# VGS Test App

This is a simple single-page application and microservice for VGS as a part of their employment technical test.

## Before Running The App

+ You need to have the TLS Authentication configured at the dashboard (Dashboard > Settings > TLS Certificates), and a corresponding `.pem` file to authenticate with.

+ There needs to be a `.env` file with the following fields:
    + `SESSION_SECRET` that contains the express session secret (If you get an error about express session being deprecated it may be because this is empty)
    + `PORT` for the port number that this application will run on.
    + `HTTPS_PROXY_USERNAME` is the username for your forward proxy (from Dashboard > Settings > Access Credentials)
    + `HTTPS_PROXY_PASSWORD` is the password created with the above username
    + `FORWARD_HTTPS_PROXY_HOST` is _tenantid_.sandbox.verygoodproxy.com 
    + `FORWARD_HTTPS_PROXY_PORT` is the proxy port number
    + `FORWARD_HTTPS_PROXY_PEM` is the path to the .pem file to authenticate to `FORWARD_HTTPS_PROXY_HOST`, and the corresponding certificate and private key need to be added to the vault (Dashboard > Settings > TLS Certificates)

## How to use

The default view opens up to the `Encrypt` tab. You can enter the credit card number, CVV and Expiration Date to encrypt them. The page will return the information to you. The redacted information can then be entered into the fields under the `Decrypt` tab, and the raw data gets echoed to the echo server and returned to the user.
