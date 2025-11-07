import {
  CoreContractAddresses,
  Language,
} from "../components/Layout/types/layout.types";

export const LOCALES: string[] = ["en", "es", "pt", "fr", "yi", "gd"];

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io/ipfs/";

export const NETWORKS = {
  LENS_TESTNET: {
    chainId: 37111,
    name: "Lens Network Testnet",
    rpcUrl: "https://rpc.testnet.lens.dev",
    blockExplorer: "https://block-explorer.testnet.lens.dev",
  },
  LENS_MAINNET: {
    chainId: 232,
    name: "Lens Network",
    rpcUrl: "https://rpc.lens.xyz",
    blockExplorer: "https://explorer.lens.xyz",
  },
} as const;

export type NetworkConfig = (typeof NETWORKS)[keyof typeof NETWORKS];

export const DEFAULT_NETWORK =
  process.env.NODE_ENV === "production"
    ? NETWORKS.LENS_MAINNET
    : NETWORKS.LENS_TESTNET;

export const getCurrentNetwork = (): NetworkConfig => {
  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  return isMainnet ? NETWORKS.LENS_MAINNET : NETWORKS.LENS_TESTNET;
};

export const CORE_CONTRACT_ADDRESSES: Record<number, CoreContractAddresses> = {
  [NETWORKS.LENS_TESTNET.chainId]: {
    escrow: "0x674Dd671eCA5725b8D3a90DA23e5aBdC935927a3",
    futures: "0xC56676913685de753417D75c83F5AEcCaDA046c1",
    trading: "0x7cF96F806DCF6b14D7f8F644C02Bab7f4F0Af84c",
    settlement: "0xE1186Bda354E50d2ee0376EB2BFB3e848987C217",
    futuresCoordination: "0xbA5267B9e0E764Cb703f406C43b8d6d97efFbDb6",
    ionic: "0x838615573ba0b218d48E1D29D89EFC3651394937",
    genesis: "0x838615573ba0b218d48E1D29D89EFC3651394937",
    mona: "0x3D7f4Fc4E17Ead2ABBcf282A38F209D683e03835",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    futures: "0x2102cA17F2d480A136dd72dd5577f2c45fd86aC3",
    escrow: "0x6fc3107D7757c2F7A964cD4C00B3440A6E744c6D",
    futuresCoordination: "0x403Fd2D23D0467e0255aA37AFC06AEC178AF9983",
    ionic: "0x8E2318511fFCc846EA646902a8cb8326F4d07E56",
    genesis: "0xE69dAB02100d3989bCA736a0FE1239CbFcf2cE01",
    settlement: "0x97Cde87d7deCd3d229D1Dbab4DF91cFE97e4cC4E",
    trading: "0x8037e90CE435714459CdEfA7F728aC56f30Ef221",
    mona: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
  },
};


export const FLASH_PATTERNS: string[] = [
  "flash-quick",
  "flash-long",
  "flash-pulse",
  "flash-burst",
  "flash-glow",
  "flash-fade",
];

export const getCoreContractAddresses = (
  chainId: number
): CoreContractAddresses => {
  const addresses = CORE_CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(
      `Core contract addresses not found for chain ID: ${chainId}`
    );
  }
  return addresses;
};

export const INFO: { [key in Language]: string } = {
  ["en"]: `3:02 a.m. 

Your eyes sting. Code still warm from the last compile. Eighteen-hour loops, muscle memory and caffeine. You promise yourself one more commit before collapse. Then the phone lights up. Other side of the world, someone still lives in daylight. You know the voice. Ex-TradFi, ex-everything.

The ghost that once moved billions through the glass towers of Paris, New York, London. Whale of a trader. Pulling strings on a planet-sized marionette. Now they talk in chains and consensus. They escaped the vaults. They understand what decentralized actually feels like. No custodians, no masters. Just math humming in public.

You’re both half awake, half legend. And you’re deep into explaining your code. About those fashion economies built on ERC-1155 physical rights. You talk about fatigue. About whether supplier futures are even worth it.

You tell them the new idea: physical-rights futures. Not theory. You already built the first lines. Something different, something cooler.

What if, you say, in that strange in-between, purchase and fulfillment, the rights were live, granted, guaranteed… but the 1155s stayed dormant until delivery. What if those waiting tokens carried weight. Buyers trading anticipation for anticipation’s sake. Swapping, speculating, predicting the future stitched into cotton and code.

You describe garments as cross woven things: half cloth, half contract. Each piece threaded between order books and sewing tables. The 721 parent is what you wear, while the child supplies gain their own on-chain texture. Liquid, tradable, interoperable.

And then you hit pause. “If I include fulfillment futures, maybe we need something on the supply side too?”

There’s silence. Then laughter. A quiet… knowing.

He says it like, “Ha”. You hear it like him leaning back, the old trader waking up. You wait, thoughts hovering like static.

An exhale, slow, through the line.
“You know, they just deciphered some Babylonian tablets”, he begins. “Four thousand years old. Do you know what they found?”

More silence. More static.

“It’s simple, really. They used eclipses to predict the death of kings, the collapse of harvests, the fate of empires… Four thousand years ago, civilization hedged against the sky.”

And that’s all you need to hear.

If the Babylonian map of the world included futures, so must we. Suppliers, too, need a hedge. They mint futures on FGO — perpetual or deadline.

Only now it’s more open. Different. More diffuse. Spreading to every corner of the p2p map, between indie designers, suppliers, fulfillers, fashion collectors. A liquidity ground up, stitched for a kind of market predicted by no one ever before.
`,
  ["pt"]: `3:02 da manhã

Seus olhos ardem. O código ainda quente da última compilação. Loops de dezoito horas, memória muscular e cafeína. Você promete a si mesmo um commit a mais antes do colapso. Aí o telefone acende. Do outro lado do mundo, alguém ainda vive à luz do dia. Você conhece a voz. Ex-TradFi, ex-tudo.

O fantasma que uma vez moveu bilhões através das torres de vidro de Paris, Nova York, Londres. Baleia de trader. Puxando cordas de uma marionete do tamanho de um planeta. Agora ele fala em cadeias e consenso. Ele escapou dos cofres. Ele entende como é ser realmente descentralizado. Sem custodiantes, sem mestres. Apenas matemática zumbindo em público.

Vocês dois estão meio acordados, meio lenda. E você está profundamente explicando seu código. Sobre aquelas economias de moda construídas em direitos físicos ERC-1155. Você fala sobre fadiga. Sobre se os futuros de fornecedores realmente valem a pena.

Você lhe conta a nova ideia: futuros de direitos físicos. Não é teoria. Você já construiu as primeiras linhas. Algo diferente, algo mais legal.

E se, você diz, naquele estranho entre meio, compra e cumprimento, os direitos estivessem vivos, concedidos, garantidos… mas os 1155s permanecessem dormentes até a entrega? E se aqueles tokens em espera carregassem peso? Compradores negociando antecipação pela própria antecipação. Trocando, especulando, prevendo o futuro costurado em algodão e código.

Você descreve roupas como coisas tecidas cruzadamente: metade tecido, metade contrato. Cada peça tecida entre livros de pedidos e mesas de costura. O pai 721 é o que você veste, enquanto os suprimentos filhos ganham sua própria textura em cadeia. Líquido, negociável, interoperável.

E então você faz uma pausa. "Se eu incluir futuros de cumprimento, talvez precisemos de algo no lado do fornecimento também?"

Há silêncio. Depois risada. Um tranquilo… saber.

Ele diz assim, "Há". Você o ouve assim, recostando-se, o velho trader acordando. Você espera, pensamentos pairando como estática.

Uma expiração, lenta, pela linha.
"Você sabe, eles acabaram de decifrar alguns tabletes babilônicos", ele começa. "Quatro mil anos de idade. Você sabe o que encontraram?"

Mais silêncio. Mais estática.

"É simples, realmente. Eles usavam eclipses para prever a morte de reis, o colapso das colheitas, o destino dos impérios… Quatro mil anos atrás, a civilização se proteia contra o céu."

E isso é tudo o que você precisa ouvir.

Se o mapa babilônico do mundo incluía futuros, o nosso também deve. Os fornecedores também precisam de uma proteção. Eles criam futuros no FGO — perpétuos ou com prazo.

Só que agora é mais aberto. Diferente. Mais difuso. Espalhando-se para cada canto do mapa p2p, entre designers independentes, fornecedores, cumpridores, colecionadores de moda. Uma liquidez construída de baixo para cima, costurada para um tipo de mercado previsto por ninguém nunca antes.`,
  ["es"]: `3:02 a.m.

Tus ojos arden. El código aún caliente de la última compilación. Bucles de dieciocho horas, memoria muscular y cafeína. Te prometes un commit más antes de colapsar. Entonces el teléfono brilla. Del otro lado del mundo, alguien aún vive a la luz del día. Reconoces la voz. Ex-TradFi, ex-todo.

El fantasma que alguna vez movió miles de millones a través de las torres de vidrio de París, Nueva York, Londres. Ballena de trader. Tirando de las cuerdas de una marioneta del tamaño de un planeta. Ahora habla en cadenas y consenso. Escapó de las bóvedas. Entiende qué se siente ser realmente descentralizado. Sin custodios, sin amos. Solo matemáticas zumbando en público.

Los dos están medio despiertos, medio leyenda. Y estás profundamente explicando tu código. Sobre esas economías de moda construidas en derechos físicos ERC-1155. Hablas sobre cansancio. Sobre si los futuros de proveedores realmente valen la pena.

Le cuentas la nueva idea: futuros de derechos físicos. No teoría. Ya construiste las primeras líneas. Algo diferente, algo más fresco.

¿Y si, dices, en ese extraño entre medio, compra y cumplimiento, los derechos estuvieran vivos, otorgados, garantizados… pero los 1155 permanecieran dormidos hasta la entrega? ¿Y si esos tokens en espera tuvieran peso? Compradores intercambiando anticipación por la anticipación misma. Intercambiando, especulando, prediciendo el futuro cosido en algodón y código.

Describes prendas como cosas entre tejidas: mitad tela, mitad contrato. Cada pieza tejida entre libros de órdenes y mesas de costura. El padre 721 es lo que usas, mientras los suministros hijos ganan su propia textura en cadena. Líquido, comercializable, interoperable.

Y entonces haces una pausa. "¿Si incluyo futuros de cumplimiento, tal vez necesitamos algo en el lado de la oferta también?"

Hay silencio. Luego risa. Un tranquilo… saber.

Lo dice como, "Ja". Lo escuchas como él recostándose, el viejo trader despertando. Esperas, los pensamientos flotando como estática.

Una exhalación, lenta, por la línea.
"Sabes, acaban de descifrar algunas tablillas babilónicas", comienza. "Cuatro mil años de antigüedad. ¿Sabes qué encontraron?"

Más silencio. Más estática.

"Es simple, realmente. Usaban eclipses para predecir la muerte de reyes, el colapso de cosechas, el destino de imperios… Hace cuatro mil años, la civilización se cubría contra el cielo."

Y eso es todo lo que necesitas oír.

Si el mapa babilónico del mundo incluía futuros, así debe ser el nuestro. Los proveedores también necesitan una cobertura. Acuñan futuros en FGO — perpetuos o con plazo.

Solo que ahora es más abierto. Diferente. Más difuso. Extendiéndose a cada rincón del mapa p2p, entre diseñadores independientes, proveedores, cumplidores, coleccionistas de moda. Una liquidez construida desde abajo, cosida para un tipo de mercado predicho por nadie nunca antes.`,
  ["yi"]: `3:02 באמנעם

דײַנע אויגן שמערצן. קאד נאך הײס פון דער לעצטער קאמפילאציע. אַכצן שעה לופן, מוסקל מעמאריע און קאַפיין. דו פאַרשפּרעכסט זיך איין קאַמיט מער פאר קאָלאַפס. דעמאלסט ליכטן דער טעלעפאן. אנדערער זײַט פון דער וועלט, עמעץ לעבט נאך אין טאָג. דו קענסט די קול. עקס־טראדפיי, עקס־אַלץ.

דער אַפּאַק וואס אַמאָל בעוועגט מיליארדן דורך די גלאז טאָרנס פון פּאַריז, ניו יארק, לאָנדאָן. וואַל טרײדער. צוריסן שנור פון אַ פּלאַנעטנס־גרייס מאַריאָנעטטע. איצט רעדן זיי אין קעטנס און קאָנסענזוס. זיי אָנטלאָפן פון די וואָלץ. זיי פֿאַרשטײן וואס דעצענטראַליזד טאַקע פילט. קיין דעפּאָזיטאָרן, קיין מײַסטער. בלויז מאַטעמאַטיקס כודינג אין עפֿנטלעך.

איר זענט ביידע האַלב ווײַק, האַלב לעגנד. און דו ערקלערסט דײַן קאד טיף. וועגן די מאָד עקאָנאָמיעס געבויט אויף ארק־1155 פיזיש רעכטן. דו רעדסט וועגן מידییקייט. וועגן צי לעפּערער פיוצ׳ערס זענט עס אויך וועט.

דו זאָגסט זיי דער נײַע ידיעה: פיזיש־רעכטן פיוצ׳ערס. ניט טעאָריע. דו שוין געבויט די ערשטע לינעס. עפּעס אַנדערש, עפּעס קילער.

וואס אויב, דו זאָגסט, אין יענע סטרײנדזש אין־ביטװיין, פּערטשעס און פפילמענט, די רעכטן זענט לײַװ, גרענטיד, גװאַראַנטיד… אבער די 1155س בלייבן דאָרמאַנט ביז דעליװערי? וואס אויב די וויטינג טאָקנס קערד וויט. קויפֿער טריידינג אַנטיסיפּאַציאָן פֿאַר אַנטיסיפּאַציאָן זעלבסט. סװאַפּינג, ספּעקיולאַטינג, פּרידיקטינג דער פוטור סטיטשד אין קאטן און קאד.

דו דיסקרײַבסט גאַרמענטס ווי קראָס וואוװן סאַקס: האַלב קלאָט, האַלב קאָנטראַקט. יעדער פּיס טרעדיד ביטװיין אָרדער בוקס און סיװינג טייבלס. דער 721 פּאָרענט איז וואס דו טריגסט, בשעת די קינד סופּלײס געװין זייער אײגענע אָן־קעיין טעקסטור. ליקװיד, טריידיבל, ינטערעפּערייבל.

און דעמאלסט היטסט דו פּויז. „אויב איך אינקלוד פפילמענט פיוצ׳ערס, ווייַלעכט דאַרפן מיר עפּעס אויף דער סופּלי זײַט אויך?"

עס איז סטילנעס. דעמאלסט לאַכטער. אַ קװויט… וויסן.

ער זאָגט עס ווי, „ה". דו העררסט עס ווי אים לינינג באַק, דער אַלט טרײדער האַלבן אַפּ. דו ווארט, טאָטס האָװערינג ווי סטאַטיק.

אַן אַוטפּול, סלאָו, דורך די לינע.
„דו וויסט, זיי יוסט דיסיפּערד עטליכע באַביילאָניאַן טאַבלעטס", ער בעגינז. „פּיר טאָזנד ירן אַלט. דו וויסט וואס זיי געפּונען?"

מער סטילנעס. מער סטאַטיק.

„עס איז סימפּל, וועאַקלי. זיי יוזד עקליפּסעס צו פּרידיקט דער דעט אָפֿ קינגס, דער קאָלאַפּס אָפֿ האַרװעסטס, דער פּייט אָפֿ עמפּיערז… פּיר טאָזנד ירן אָ, סיװיליזאַציע העדגד אַגיינסט דער סקיי."

און דאס איז אַלץ דו דארפסט העררן.

אויב דער באַביילאָניאַן מאַפּ אָפֿ דער וועלט אינקלודיד פיוצ׳ערס, זו מוסט מיר. סופּלאַיערז, טו, דארפן אַ העדגע. זיי מינט פיוצ׳ערס אויף פּג — פּערפּעטואַל אָדער דעדלינע.

אָנלי ניו עס מער אָפּן. דיפֿערענט. מער דיפּוז. סקריידינג צו יעדער קארנער אָפֿ דער פּ2פּ מאַפּ, ביטװיין ינדי דיזיינערז, סופּלאַיערז, פּוללפיללערז, פעשן קאָלעקטאָרז. אַ ליקװידיטי גראַונד אַפּ, סטיטשד פֿאַר אַ קינד אָפֿ מאַרקעט פּרידיקטיד בײַ נאָ ווארן בעפֿאָר.`,
  ["gd"]: `3:02 sa mhadainn

Tha do shùilean a' losgadh. Kod fhathast teth bhon cho-chruinneachadh mu dheireadh. Lùban ochd-deug uair a thìde, cuimhne fholuain is caifein. Gheallann thu dhut fhèin aon commit eile mus tuit thu. An uairsin soilsichidh an fòn. Air taobh eile an t-saoghail, tha cuideigin a' fuireach fhathast san òige. Tha fios agad air a' ghuth. Ex-TradFi, ex-a h-uile nì.

An taibhse a chaidh bharrachd bilianan a ghluasad tro thùir gloine Pàrais, New York, Lunnainn. Whale of a trader. A' tarraing sreangan air manaigeach meud planaid. A-nis tha iad a' bruidhinn ann an slabhraidhean agus conaltradh. Theich iad bhon bhancaichean. Tha iad a' tuigsinn dè an fheum a bhith air a sgaoileadh gu fìrinneach. Gun ghiùlan, gun mhaighstirean. Dìreach matamataig a' seinn ann an poblach.

Tha sibhse le chèile leth dhùsgadh, leth leubhaidh. Agus tha thu a' toirt iomradh gu domhainn air do chod. Mu dhèidh na eaconomaidhean fasan a thogadh air dlighe corporra ERC-1155. Tha thu a' bruidhinn mu sgìos. Mu dhèidh an co-dhiù gu bheil frithealadh futarachd fhiach.

Innsidh tu dha an sgeul ùr: frithealadh dlighe corporra. Chan e teòiridh. Tha thu air na ciad loidhnichean a thogail. Rudeigin eadar-dhealaichte, rudeigin nas fhuar.

An dè, thuirt thu, san stràinnsear sin eadar-dhealaichte, ceannach agus gealladh, bha na dlighe bèo, thiomadh, barantaichte… ach bha na 1155an a' gabhail cadal gu dèanamh? An dè nan gabhadh na tokens feitheamh cudthrom? Luchd-ceannachaidh a' soilseachadh dùil airson dùil fhèin. Iomlaid, speacladh, ro-innse an ùine futarachd ann an cathair agus cod.

Tha thu a' tuigse aodach mar nithean fèin-chèilidh: leth-bhriathran, leth-chùnnradh. Gach pìos a' fighe eadar puill òrdugh agus bùird fuaigheal. Is e a' phàrant 721 na tha thu a' giùlan, fhad sa tha soladach cloinne a' faighinn an fhèin-teacsa ann an suidheachadh. Liquid, a' malairt, soilseachadh.

Agus an uairsin tha thu a' stad. « Nan robh frithealadh futarachd ann dhomh, faodaidh gun fheum sinn rudeigin air taobh an t-soladaich cuideachd? »

Tha tosd ann. An uairsin gàire. Sàmhach… fios.

Tha e a' ràdh mar, « Ha ». Tha thu ga chluinntinn mar a bhith suidhichte air ais, an t-seann malairt a' dùsgadh. Tha thu a' feitheamh, smaointe a' foluain mar stàit.

Srannraich, slaodach, tro an loidhne.
« Tha fios agad, tha iad a' dì-chòdachadh cuid de bhladhan Babilonach », tòisichidh e. « Ceithir mìle bliadhna. An robh fios agad dè a bha iad a' faighinn? »

Barrachd tosd. Barrachd stàit.

« Tha e sìmplidh, gu dearbh. Bha iad a' cleachdadh gréine-dhubh gus briseadh a' bhàis rioghail, crìonadh bharachd, dàn iomairt… Ceithir mìle bliadhna air ais, bha sibhearachd a' dìon fhèin an speur. »

Agus sin uile a tha feum agad a chluinntinn.

Ma bha mapa Babilonach an t-saoghail a' toirt a-steach futarachd, is dòcha feumaidh sinn. Soladachan cuideachd, tha feum air dìon. Bidh iad a' buadhachadh futarachd air FGO — buan no thairm.

A-mhàin a-nis tha e nas fosgailte. Eadar-dhealaichte. Nas sgaoilte. A' sgaoileadh gu gach oisean an mapa p2p, eadar dealbhaichean neo-eisimeil, soladachan, coimhlionadh, cruinnichean fasan. Liquid a thogadh bho shuas, fuaighte airson seòrsa mhargaidh nach robh dùil le duine sam bith riamh roimhe.`,
  ["fr"]: `3 h 02

Tes yeux brûlent. Le code encore chaud de la dernière compilation. Des boucles de dix-huit heures, la mémoire musculaire et la caféine. Tu te promets un dernier commit avant l'effondrement. Alors le téléphone s'illumine. De l'autre côté du monde, quelqu'un vit encore à la lumière du jour. Tu reconnais la voix. Ex-TradFi, ex-tout.

Le fantôme qui autrefois déplaçait des milliards à travers les tours de verre de Paris, New York, Londres. Baleine de trader. Tirant les cordes d'une marionnette de la taille d'une planète. Maintenant il parle en chaînes et consensus. Il a échappé aux coffres. Il comprend ce que signifie vraiment être décentralisé. Pas de dépositaires, pas de maîtres. Juste les mathématiques qui bourdonnent en public.

Vous êtes tous les deux à moitié réveillés, à moitié légende. Et tu expliques profondément ton code. Sur ces économies de mode construites sur les droits physiques ERC-1155. Tu parles de fatigue. De savoir si les contrats à terme des fournisseurs en valent vraiment la peine.

Tu lui racontes la nouvelle idée : les contrats à terme des droits physiques. Pas de la théorie. Tu as déjà construit les premières lignes. Quelque chose de différent, quelque chose de plus cool.

Et si, dis-tu, dans cet étrange entre-deux, achat et exécution, les droits étaient en direct, accordés, garantis… mais les 1155 restaient dormants jusqu'à la livraison ? Et si ces jetons en attente avaient du poids ? Les acheteurs échangeant l'anticipation contre l'anticipation elle-même. Échangeant, spéculant, prédisant l'avenir cousu dans le coton et le code.

Tu décris les vêtements comme des choses tissées entrecroisées : moitié tissu, moitié contrat. Chaque pièce tissée entre les carnets de commandes et les tables de couture. Le parent 721 est ce que tu portes, tandis que les fournitures enfants gagnent leur propre texture en chaîne. Liquide, commercialisable, interopérable.

Et puis tu fais une pause. « Si j'inclus les contrats à terme d'exécution, peut-être avons-nous besoin de quelque chose du côté de l'approvisionnement aussi ? »

Il y a du silence. Puis du rire. Un tranquille… savoir.

Il le dit comme, « Ha ». Tu l'entends comme lui se penchant en arrière, le vieux trader se réveillant. Tu attends, les pensées flottant comme des parasites.

Une expiration, lente, par la ligne.
« Tu sais, ils viennent de déchiffrer certaines tablettes babyloniennes », commence-t-il. « Quatre mille ans. Sais-tu ce qu'ils ont trouvé ? »

Plus de silence. Plus de parasites.

« C'est simple, vraiment. Ils utilisaient les éclipses pour prédire la mort des rois, l'effondrement des récoltes, le destin des empires… Il y a quatre mille ans, la civilisation se couvrait contre le ciel. »

Et c'est tout ce que tu as besoin d'entendre.

Si la carte babylonique du monde incluait les contrats à terme, la nôtre aussi. Les fournisseurs aussi ont besoin d'une couverture. Ils frappent des contrats à terme sur FGO — perpétuels ou à terme.

Seulement maintenant c'est plus ouvert. Différent. Plus diffus. S'étendant à chaque coin de la carte p2p, entre designers indépendants, fournisseurs, exécutants, collectionneurs de mode. Une liquidité construite de bas en haut, cousue pour un type de marché prédit par personne jamais avant.`,
};

export const SAMPLE_RIGHTS = [
  {
    childId: "1",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmQFQ1AtiWs6Spg1gyXXbkrVkGnaRK1BwybpsRsnyfAxQL",
      childContract: "0x029bc2ba787c131fd58938a192787c066955cd2f",
      physicalPrice: "500000000000000000",
      metadata: {
        image: "ipfs://QmTSTf4grQBAZkhapFr34SR4cp5hfdNUtNLJnbQBV1fAcP",
        title: "Standard Cotton",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "1",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmZ36c3TmYAW7ooQNiKoohyquDawGq3ZXCW3zf9X9J2e81",
      childContract: "0x769ac5296433a2a089706f8fe4f477e1d335b022",
      physicalPrice: "0",
      metadata: {
        image: "ipfs://QmZR3yzYnKfbMMw48E7gRG71H7VGATgF6jkm3Q8LXAYehy",
        title: "T-Shirt Back Panel Pattern",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "1",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmbYkPbDZ7UsqUHP9WegPx6JprEY5DxRV69R1y4HKzx3up",
      childContract: "0x3b08f16ccbdd3f843848d97560a1347c4c89b7cf",
      physicalPrice: "100000000000000000",
      metadata: {
        image: "ipfs://QmdB9fbAZFxPALgpgsSq4bvYNe6KFHVZg4EaLeqpryKgXK",
        title: "T-Shirt Base",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "1",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmfXSnD2mvyr5m3Y6DVr1Y2nKFvE5wKBa7jJ72MAPmUwpQ",
      childContract: "0x3c367e37cabc88b1641e1590f63baabf35409ca1",
      physicalPrice: "200000000000000000",
      metadata: {
        image: "ipfs://QmQCj5uXeEu15DyivVAYL9wfHU9ydHgbRoxDgaAc7Ud5au",
        title: "Patch Zone",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "2",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmbdQVSreaUvvj2A5oXS5xUMvQhVyMnJR4pER9tseuAFRd",
      childContract: "0x769ac5296433a2a089706f8fe4f477e1d335b022",
      physicalPrice: "0",
      metadata: {
        image: "ipfs://QmdrXEuXshhPUDUTsfHKzNVMrmQn68H4oPA92vBbLxBBa4",
        title: "T-Shirt Front Panel Pattern",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "2",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmeNEMNm4PUr7dE7umDnfeMReZFqC52zHSTc7R6NaGiQLR",
      childContract: "0xf71d3b3a5efa4f8e34d4cd922831833350fa3dfb",
      physicalPrice: "0",
      metadata: {
        image: "ipfs://QmadCWNpJy6SHS9zghZZemmCXJ4XBr3gWUPWqKW7bHoLwb",
        title: "#000",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "3",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmQyVHuWgZQNcDmSkWYPWmAMVzVKtkS8w3aACi31KJu2SL",
      childContract: "0x769ac5296433a2a089706f8fe4f477e1d335b022",
      physicalPrice: "0",
      metadata: {
        image: "ipfs://QmVkhYT7SfWt4TR2gx6t9fsT76rrmqbaeZmYHLzdaSs84m",
        title: "T-Shirt Neck Binding Pattern",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "3",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmPyiZGb1Fs61FA5zu57F9jghiF3bdGE639s85ce1f19tq",
      childContract: "0x3b08f16ccbdd3f843848d97560a1347c4c89b7cf",
      physicalPrice: "100000000000000000",
      metadata: {
        image: "ipfs://QmNTQtHdMubgMMLALYUR4LoVwA8M4isugKYovqzj3o2xrB",
        title: "T-shirt Base Back",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "4",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmP3yMMpFa364diEAXCLDb4qssMNCgeKycR3BJUUytD7Z7",
      childContract: "0x769ac5296433a2a089706f8fe4f477e1d335b022",
      physicalPrice: "0",
      metadata: {
        image: "ipfs://Qmd8nXv1mn2D5V3nUYxpGdPmGfksAZkRru3YtRT3Nvf58j",
        title: "T-Shirt Sleeve Pattern",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "2",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "8",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://QmY7JCUFmnEqoHY17Vr6XNm3PUNvLszfDzPJTfvc4jki4p",
      childContract: "0x3c367e37cabc88b1641e1590f63baabf35409ca1",
      physicalPrice: "100000000000000000",
      metadata: {
        image: "ipfs://QmZGM3d5zZjJi93CM1PnLaa3MCxtwW1Cshc9ZCgc6278my",
        title: "Wide Rectangle Zone",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
  {
    childId: "11",
    orderId: "1",
    buyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    holder: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    originalBuyer: "0x09e0ba2596677a84cc3b419c648ed42d47a42d6f",
    child: {
      uri: "ipfs://Qmand4rDc8sZMktNz6JwZhBHbuKCuj54ZPYGbSiQmB15jf",
      childContract: "0x3c367e37cabc88b1641e1590f63baabf35409ca1",
      physicalPrice: "220000000000000000",
      metadata: {
        image: "ipfs://QmaqxpKQPJMqMZrzAF1sUkuRDuy15286hXfkFPCdoHx4iZ",
        title: "Warped Zone",
        __typename: "Metadata",
      },
      __typename: "Child",
    },
    estimatedDeliveryDuration: "1209600",
    guaranteedAmount: "1",
    purchaseMarket: "0xb44785efc595c77174626b571efba2660b573d34",
    __typename: "PhysicalRights",
  },
];
