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
| `paulo-hero.png`        | Hero, Paulo de braços cruzados      |
| `paulo-professor.png`   | Seção "Com quem você vai aprender"  |
| `colunas.png`           | Fundo de "Para quem é"              |
| `justica.png`           | Fundo da chamada final              |

**Os dois retratos precisam ter fundo preto.** Eles não são recortes com
transparência. Em vez disso, o degradê de cada seção escurece até `#000` na área da
foto, e a imagem esmaece as bordas dentro desse preto — o retângulo desaparece sem
editar a imagem e sem alterar as cores do rosto e da gravata.

São duas peças que trabalham juntas, uma de cada lado da borda:

- **Hero** — `.hero-photo::before` cria um poço de preto maior que a imagem, que
  some no azul; a máscara em `.hero-photo img` chega a zero exatamente na borda.
- **Professor** — o `linear-gradient` de `.teacher::before` é preto na coluna da
  foto e abre para o azul à direita; `.teacher-photo img` esmaece na saída.

Trocando por uma foto de fundo claro, esse efeito não se aplica: aí o caminho é um
PNG recortado, e as máscaras podem ser removidas.

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
