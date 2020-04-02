# A&AI Testcollector

This is a test collector for http request to test clients for ONAP A&AI project. Up to now its collecting all http GET, POST, PUT and DELETE requests and logs them to stdout.

Language: Typescript

## Usage

```
git clone https://github.com/highstreet-technologies/aai-testcollector.git
cd aai-testcollector
npm run build
npm run start
```

## Docker

To build a docker image you just have to run ```./build.sh docker```. The image will be tagged with latest and the version in package.json.

```
docker run aai-testcollector
```

## License

APACHE 2.0 License