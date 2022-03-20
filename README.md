<div id="top"></div>
<!-- PROJECT SHIELDS -->


<!-- PROJECT LOGO -->
<h3 align="center">HAL9001</h3>

  <p align="center">
    A simple yet powerful tendermint based node monitoring service
    <br />
    <a href="https://github.com/IDEP-network/Hal9001"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/IDEP-network/Hal9001/issues">Report Bug</a>
    ·
    <a href="https://github.com/IDEP-network/Hal9001/issues">Request Feature</a>
  </p>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Project

Hal9001 listens to Tendermints RPC over 26657 port and relays activity and important information over Discord notifying
the `operator(s)` of the nodes current status. Hal is also able to listen to multiple nodes at the same time. Hal keeps
his data in Redis and makes it readily available to the operator(s) via commands on Discord.


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- BUILT WITH -->

### Built With

* [Node.js](https://nodejs.org/en/)
* [Redis](https://redis.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [Discord.js](https://discord.js.org/#/)
* [Telegraf.js](https://telegraf.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->

## Getting Started

_You need these before we begin_

### Prerequisites

#### with Docker

* docker
  ```sh
  sudo apt-get install docker-ce docker-ce-cli containerd.io
  ```

#### without Docker

* update local package cache
  ```sh
  sudo apt-get update 
  ```
* npm
  ```sh
  sudo apt-get install npm
  ```
* ts-node
  ```sh
  npm install ts-node -g
  ```
* typescript
  ```sh
  npm install -g typescript
  ```
* git
  ```sh
  sudo apt-get install git-all
  ```
* redis
  ```sh
  sudo apt-get install redis-server
  sudo systemctl status redis
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/IDEP-network/Hal9001.git
   ```
2. Change the directory
   ```sh
   cd Hal9001/
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
   You might need to upgrade to a newer version of node `17.2` if so start by installing **NVM**
   <details>
   <ul>
   <li>

   ```sh
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
   ```
   </li>
   <li>

   After restarting the terminal upgrade node to  `17.2`
   ```sh
   nvm install 17.2 -g
   ```
   </li>
   </ul>
   </details>


4. Configure Hal

* copy content from **.env.example** and fill in the required parameters in **.env**
    ```sh
    cp .env.example .env
    ```

* fill in the preferred parameters in **src/config.ts**
   ```sh
   vim src/config.ts
   ```

  You will need:
    * ip address of your node
    * your discord ID (which type is number. Discord tutorial can be found
      here [here](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token))

<p align="right">(<a href="#top">back to top</a>)</p>

5. Clear Redis memory

    ```sh
    redis-cli FLUSHALL
    ```
6. Start Hal

   ```sh
   ts-node src
   ```
   or
    ```sh
   npm run start
   ```

### Run with Docker

As well as you can install and run project with Docker

   ```sh
   docker-compose up -d
   ```

### Usage

command structure `<prefix><command-name> <arg..1> <arg..2>`

command example     `!config operators view`

- help
  ```sh
  help
  ```

- operators
    ```sh
    config operators add <@mention>
    config operators remove <@mention>
    config operators view
    ```

- nodes
    ```sh
    config nodes add <node_address> <?name>
    config nodes remove <name>
    config nodes view
    ```

- cycleTime
    ```sh
    config cycleTime set <time in seconds>
    config cycleTime view
    ```
- notifyCycleTime
  ```sh
  config notifyCycleTime set <time in seconds>
  config notifyCycleTime view
  ```

<!-- ROADMAP -->

## Planned Roadmap

- [x] ~~kill Frank Poole~~
- [ ] Add telegram notifications
- [ ] Setup Docker

See the [open issues](https://github.com/IDEP-network/Hal9001/issues) for a full list of proposed features (and known
issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->

## Contact

[IDEP-Network](https://twitter.com/idep-network) - hello@IDEP.network

Project Link: [https://github.com/IDEP-network/Hal9001](https://github.com/IDEP-network/Hal9001)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

### reserved

<p align="right">(<a href="#top">back to top</a>)</p>
<br />
<br />
<br />
<br />

_I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do._
