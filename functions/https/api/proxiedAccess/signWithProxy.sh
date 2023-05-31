read -p "Enter your email: " email
read -p "Enter your password: " password

data='{
    "username": "'"$email"'",
    "password": "'"$password"'",
    "grant_type": "password"
}'

curl -x https://cl35.nordvpn.com:89 --proxy-user iMKkVxr6oRSVxr3Z17Q3M9d8:fLpH1XWfztnpojoQRV1ZDuPn -X POST -H "Content-Type: application/json" -d "$data" https://lomi.cl/spree_oauth/token
