import https from 'https';

const host = 'aptitude-problem-solver.vercel.app';
const key = '4c947230df934f828a2a758d4a46a5b6';
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  `https://${host}/`,
  `https://${host}/quantitative-aptitude`,
  `https://${host}/logical-reasoning`,
  `https://${host}/data-interpretation`,
  `https://${host}/verbal-ability`,
  `https://${host}/company-wise`,
  `https://${host}/about`,
  `https://${host}/contact`,
  `https://${host}/terms`,
  `https://${host}/disclaimer`,
  `https://${host}/privacy-policy`,
  `https://${host}/editorial-policy`
];

const postData = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Sending IndexNow notification to Bing and Yandex endpoints...');

const req = https.request(options, (res) => {
  console.log(`IndexNow HTTP Status Code: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('[SUCCESS] IndexNow submission received by Bing & Yandex API!');
    } else {
      console.log(`[INFO] IndexNow returned status ${res.statusCode} (URL set submitted).`);
    }
  });
});

req.on('error', (e) => {
  console.error(`[ERROR] IndexNow submission failed: ${e.message}`);
});

req.write(postData);
req.end();
