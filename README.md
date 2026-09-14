# Workshop Escritório De Facto — landing page

Página de captação do workshop **"Passou na OAB, e agora?"**, com Paulo Schmoller.
HTML, CSS e JavaScript puros — sem build, sem dependências. Basta publicar a pasta
em qualquer hospedagem estática.

## Estrutura

```
index.html            # markup completo da página
assets/css/style.css  # design system + todas as seções
assets/js/main.js     # menu, máscara de telefone, validação e envio do formulário
assets/img/           # fotos da página (ver abaixo)
```

## Seções

| Âncora        | Seção                                                      |
| ------------- | ---------------------------------------------------------- |
| `#workshop`   | Hero — headline, promessa e barra de informações do evento |
| `#inscricao`  | Oferta + card de preço e formulário de inscrição            |
| `#professor`  | Apresentação de Paulo Schmoller e credenciais               |
| `#aprender`   | Os 6 blocos de conteúdo do workshop                         |
| `#para-quem`  | Público-alvo e checklist                                    |
| `#duvidas`    | Bloco "Tire suas dúvidas ao vivo" (dentro de `#aprender`)   |

## Imagens

As quatro fotos ficam em `assets/img/`:

| Arquivo                 | Onde aparece                        |
| ----------------------- | ----------------------------------- |
| `paulo-hero.jpg`        | Hero, Paulo de braços cruzados      |
| `paulo-professor.jpg`   | Seção "Com quem você vai aprender"  |
| `colunas.jpg`           | Fundo de "Para quem é"              |
| `justica.jpg`           | Fundo da chamada final              |
| `defacto-logo.svg`      | Logo, no cabeçalho e no rodapé      |

O logo está **em curvas** e é embutido no HTML, e não referenciado por `<img>`,
para o CSS poder recolori-lo: o que é azul-marinho no arquivo (`.lg-navy` e
`.lg-stroke`) vira branco, e "FACTO" e o filete (`.lg-gray`) saem da variável
`--logo-gray`. Para trocar o logo, substitua o arquivo e reconverta as cores em
classes — nenhuma cor literal deve ficar no `index.html`.

As fotos entram **sem nenhum tratamento pelo CSS** — nada de máscara, blend ou
esmaecimento. O que estiver no arquivo é o que aparece, inclusive o fundo. O fundo
de cada seção continua sendo o degradê azul, independente da foto.

Ou seja, o recorte é responsabilidade da imagem: para o retrato do hero flutuar
sobre o azul, como no layout, exporte um **PNG com fundo transparente**. Enquanto o
arquivo tiver fundo preto, ele aparece como um retângulo preto — que é o
comportamento esperado aqui.

Trocando qualquer arquivo, mantenha o nome. Se precisar de outro nome ou extensão,
ajuste o `src` no `index.html` e a lista `placeholders` em `assets/js/main.js`.
Faltando um arquivo, a página mostra um marcador discreto no lugar — nada quebra.

## Formulário

Por padrão o formulário valida os campos e mostra a mensagem de sucesso **sem enviar
nada**. Para integrar ao seu CRM ou checkout, informe a URL no topo de
`assets/js/main.js`:

```js
var ENDPOINT = 'https://seu-crm.exemplo.com/inscricoes';
```

O envio é um `POST` JSON:

```json
{ "nome": "Ana Ribeiro", "email": "ana@exemplo.com.br", "telefone": "+5595991234567" }
```

## Personalização rápida

Cores, fontes e larguras ficam nas variáveis do topo de `assets/css/style.css`
(bloco `:root`) — azul-marinho, dourado e creme, além das famílias tipográficas.

Data, horário, preço e textos estão diretamente no `index.html`.

## Desenvolvimento

Não há etapa de build. Para ver localmente:

```sh
python3 -m http.server 8000
# abra http://localhost:8000
```

## Compatibilidade e acessibilidade

- Responsiva de 320px ao desktop, sem rolagem horizontal.
- Navegação por teclado, `skip link`, rótulos nos campos e erros com `aria-invalid`.
- Respeita `prefers-reduced-motion` (desliga animações de entrada).
