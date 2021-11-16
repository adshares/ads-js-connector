<p align="center">
  <a href="https://adshares.net/">
    <img src="https://adshares.net/logos/ads.svg" alt="Adshares" width=72 height=72>
  </a>
  <h3 align="center"><small>ADS Wallet Connector</small></h3>
  <p align="center">
    <a href="https://github.com/adshares/ads-js-connector/issues/new?template=bug_report.md&labels=Bug">Report bug</a>
    ·
    <a href="https://github.com/adshares/ads-js-connector/issues/new?template=feature_request.md&labels=New%20Feature">Request feature</a>
    ·
    <a href="https://github.com/adshares/ads-js-connector/wiki">Wiki</a>
  </p>
</p>

<br>

ADS Wallet Connector is an **browser JavaScript** connector to [ADS Browser Wallet](https://github.com/adshares/ads-browser-wallet).

## Getting Started

Place the following script near the end of your pages, right before the closing `</body>` tag, to enable ADS connector.

```html
<script src="https://connect.adshares.net/dist/ads-connector.min.js" crossorigin="anonymous"></script>
```

## Usage

### ADS Wallet

All methods return Promises.

```
const ads = new Ads(); // pass true to enable testnet

// authenticate
ads.authenticate('nonce').then(...)

// broadcast
ads.broadcast('4164736861726573').then(...)

// transfer
ads.sendOne('0001-00000001-8B4E', 1.23, '4164736861726573').then(...)

```

#### Responses

``` 
// --- authenticate ---
{
    status: string,         // "accepted" or "rejected",
    testnet: boolean,
    signature: string,      // signature of the nonce
    account: {
        address: string,    // account address, eg. '0001-00000001-8B4E'
        publicKey: string,  // account public key
        balance: string,    // current accoun balance in ADS (float as string)
        messageId: integer, // current account message id
        hash: string        // current account hash
    }
}
```
``` 
// --- broadcast/sendOne ---
{
    status: string,         // 'accepted' or 'rejected',
    testnet: boolean,
    transaction: {
        id: string,         // transaction id, eg. '0001:00002361:0001'
        type: string,       // transaction type ('broadcast', 'send_one'),
        fee: string         // transaction fee in ADS (float as string)
    }
}
```

### Contributing

Please follow our [Contributing Guidelines](docs/CONTRIBUTING.md)

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/adshares/ads-js-connector/tags). 

## Authors

- **[Maciej Pilarczyk](https://github.com/m-pilarczyk)** - _programmer_

See also the list of [contributors](https://github.com/adshares/ads-js-connector/contributors) who participated in this project.

### License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## More info

- [ADS Blockchain Wiki](https://github.com/adshares/ads/wiki)
- [ADS Browser Wallet](https://github.com/adshares/ads-browser-wallet)
- [ADS JS Wallet Client](https://github.com/adshares/ads-js-wallet)
