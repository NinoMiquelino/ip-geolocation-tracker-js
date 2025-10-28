## 👨‍💻 Autor

<div align="center">
  <img src="https://avatars.githubusercontent.com/ninomiquelino" width="100" height="100" style="border-radius: 50%">
  <br>
  <strong>Onivaldo Miquelino</strong>
  <br>
  <a href="https://github.com/ninomiquelino">@ninomiquelino</a>
</div>

---

# 🌐 IP Geo Tracker: Localizador de Endereço IP Interativo com Mapa

![JavaScript](https://img.shields.io/badge/Frontend-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![License MIT](https://img.shields.io/badge/License-MIT-green)
![Status Stable](https://img.shields.io/badge/Status-Stable-success)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue)
![GitHub stars](https://img.shields.io/github/stars/NinoMiquelino/ip-geolocation-tracker-js?style=social)
![GitHub forks](https://img.shields.io/github/forks/NinoMiquelino/ip-geolocation-tracker-js?style=social)
![GitHub issues](https://img.shields.io/github/issues/NinoMiquelino/ip-geolocation-tracker-js)

## 📍 Sobre o Projeto

O **IP Geo Tracker** é uma ferramenta de geolocalização IP moderna e interativa. Este projeto *front-end* foi desenvolvido para buscar, validar e exibir detalhes geográficos de qualquer endereço IP (IPv4 ou IPv6), usando uma interface limpa e responsiva.

Além de fornecer informações como cidade, país e ISP, o projeto visualiza a localização exata em um mapa interativo do OpenStreetMap, permitindo a troca de camadas (Ruas, Satélite, Topográfico).

### ✨ Funcionalidades Principais

* **Busca por IP:** Pesquisa qualquer endereço IPv4 (formato pontuado ou decimal longo) ou IPv6.
* **IP do Usuário:** Exibe automaticamente a geolocalização do usuário ao carregar a página.
* **Validação Robusta:** Implementação de Regex avançada para validar formatos IPv4 e IPv6 antes da chamada à API.
* **Visualização em Mapa:** Exibe a localização exata com um marcador no mapa interativo (Leaflet/OSM).
* **Troca de Camadas (Tiles):** Permite alternar entre as visualizações de Ruas, Satélite e Topográfico.
* **Detalhes Completos:** Exibe dados como Hostname, ISP, Fuso Horário, CEP e Coordenadas.

## 🚀 Tecnologias Utilizadas

| Tecnologia | Função |
| :--- | :--- |
| **HTML5/CSS3** | Estrutura e Estilização Base |
| **Tailwind CSS** | Framework CSS para design responsivo e utilitário |
| **JavaScript (ES6+)** | Lógica de busca, validação e manipulação do DOM |
| **Leaflet.js** | Biblioteca líder para mapas interativos e mobile-friendly |
| **OpenStreetMap (OSM)** | Fonte gratuita e de código aberto para os dados do mapa (tiles) |
| **IPinfo.io API** | Provedor de dados de geolocalização IP (usando o plano gratuito) |

## 🧩 Estrutura do Projeto

```
ip-geolocation-tracker-js/
├── index.html
├── script.js
├── README.md
├── .gitignore
└── LICENSE
```

## ⚙️ Como Utilizar

Basta abrir o arquivo `index.html` em seu navegador.

1.  **Visão Inicial:** O mapa e os cartões exibirão automaticamente os detalhes do seu próprio endereço IP.
2.  **Pesquisar Outro IP:** Digite o endereço IPv4 (ex: `8.8.8.8`) ou IPv6 (ex: `2001:4860:4860::8888`) no campo de busca.
3.  **Buscar IP Decimal:** Endereços IPv4 no formato decimal (long integer) também são aceitos e validados.
4.  **Trocar Visualização:** Utilize os botões de rádio na seção "Camadas do Mapa" para alternar entre as visualizações Ruas, Satélite e Topográfico.

## 📝 Instalação e Configuração Local

Este projeto é totalmente *front-end* e não requer nenhum *backend* ou chave de API paga, pois utiliza a API pública e gratuita da IPinfo.io.

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/](https://github.com/)[SEU_USUARIO]/ip-geolocation-tracker-js.git
    ```
2.  **Navegue até a Pasta:**
    ```bash
    cd ip-geolocation-tracker-js
    ```
3.  **Abra no Navegador:**
    Abra o arquivo `index.html` diretamente em seu navegador.

---

## 🤝 Contribuições
Contribuições são sempre bem-vindas!  
Sinta-se à vontade para abrir uma [*issue*](https://github.com/NinoMiquelino/ip-geolocation-tracker-js/issues) com sugestões ou enviar um [*pull request*](https://github.com/NinoMiquelino/ip-geolocation-tracker-js/pulls) com melhorias.

---

## 💬 Contato
📧 [Entre em contato pelo LinkedIn](https://www.linkedin.com/in/onivaldomiquelino/)  
💻 Desenvolvido por **Onivaldo Miquelino**

---
