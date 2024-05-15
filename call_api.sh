

curl --location "http://localhost:3033/api/v1/user" \
    --header 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
    --header 'Content-Type: application/json' \
    --data '{
        "min": 1,
        "max": 50,
        "modBody": -7,
        "modFailurePred" : -1
    }'