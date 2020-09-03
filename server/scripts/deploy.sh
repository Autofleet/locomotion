dir=$(pwd)
dir="$(basename $dir)"
image_name="gcr.io/locomotion-revel/$dir:$(git branch | sed -n -e 's/^\* \(.*\)/\1/p' | sed 's/\//-/g' )-$(date +"%H-%M-%S")"
echo $image_name
docker build . -t $image_name --build-arg NPM_TOKEN=$NPM_TOKEN
docker push $image_name
gcloud config set project locomotion-revel
gcloud run deploy $1 --image $image_name --platform managed --region europe-west1 --allow-unauthenticated
