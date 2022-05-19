import { ethers } from "hardhat";
import "cross-fetch/polyfill";

import pinataSDK from "@pinata/sdk";
import { Signature } from "ethers";
import { parseUnits } from "ethers/lib/utils";

import { signMessage } from "../test/utils";

const day = 24 * 60 * 60;
const ipfsHash = "QmecuCbVsMRTof2eTjiXUN1bmUxTSuQFeL7zkWFS6Euf1p";

const whitelist = [
    {
        address: '0xbcB6899aC07FFeAe9Bb5f4650A7e3AFE97075824',
        amount: 9,
    },
    {
        address: '0x9b3DB1A5EdAD15Ec9aa973978A90C0A8763Cf88B',
        amount: 1,
    },
    {
        address: '0xf2Bf1D114ccF97D20A7a0d33fDCf470bc202E6a8',
        amount: 4,
    },
    {
        address: '0xD1a733172DBf8B2b9e1815b37749CBAcc56F0F9e',
        amount: 3,
    },
    {
        address: '0x945e79ab3cFb83B43AE1F7b28882EB2340c7e9B5',
        amount: 1,
    },
    {
        address: '0xe8898a3352bBe9A14d6C4CC8EB4f144B16fdb2aa',
        amount: 9,
    },
    {
        address: '0x29a56dD006fcaa085f3ba4c21acf8F376a2e3726',
        amount: 3,
    },
    {
        address: '0x430D58cC66648d7b8D65a5Fd75907eB8196e1e48',
        amount: 1,
    },
    {
        address: '0x9f873b00048CbF31004968579D8beE032A509F7b',
        amount: 2,
    },
    {
        address: '0xE3C9AF6b09b92290d1C4c86E4Aa24af3Cf4e555e',
        amount: 1,
    },
    {
        address: '0xE105EBc1b57AC5a5B72acD1583Cc1816f1Cd6Ee5',
        amount: 1,
    },
    {
        address: '0xacaB7a387962A92875c68bE731bd3a23A06e6811',
        amount: 1,
    },
    {
        address: '0x96598c83881bDe5301392Fd737C5d94774b7839c',
        amount: 2,
    },
    {
        address: '0xbd3c1ae90a7463ddde9cF3B38628437Fe85fA30E',
        amount: 1,
    },
    {
        address: '0xa20bE6e68F308124e2eDB779d99DB2246672f9B5',
        amount: 1,
    },
    {
        address: '0x70d21770b6971E41330D7BB4450cA23c28b5A828',
        amount: 2,
    },
    {
        address: '0xA4552b9A8268A01d43C1F5aeE30302bf88b21Aee',
        amount: 1,
    },
    {
        address: '0xAF2d645BC00d330fe1cd2D697242515789e1e277',
        amount: 1,
    },
    {
        address: '0xaDA09c3096f568AD1A7F45f404c6eD6d1dbD4036',
        amount: 2,
    },
    {
        address: '0x69E29E2b67fb11Ee08784c7Fc1cb3B150B9321af',
        amount: 1,
    },
    {
        address: '0x816F81C3fA8368CDB1EaaD755ca50c62fdA9b60D',
        amount: 1,
    },
    {
        address: '0x06578a3DdC4714cD658f15D9dA00dFfcE07d874C',
        amount: 2,
    },
    {
        address: '0xa8493Be5449374eE945552c372f1AEa27cf5F129',
        amount: 2,
    },
    {
        address: '0x049AdE7B8CaAC25E37C654EcF2e6aFe9125Ad1d4',
        amount: 1,
    },
    {
        address: '0x2fF79f7B42FE97A72c54cFc985589B4f55A7423d',
        amount: 2,
    },
    {
        address: '0x02c1a6306E002800215A3519a30a63908676434d',
        amount: 1,
    },
    {
        address: '0xa1Cc337fc0C207b27aFc221Aa73B3bB5Cb6E3E68',
        amount: 1,
    },
    {
        address: '0x98F9C8eF0E3804642E48a93eE50FFD3A7aAC7e1f',
        amount: 2,
    },
    {
        address: '0xfc8afA3BFdDe943De915AB08F480d2B1499e9984',
        amount: 1,
    },
    {
        address: '0xC5301285da585125B1dc8CCCedD1de1845b68c0F',
        amount: 1,
    },
    {
        address: '0xe48DA446A8C859a8716Cc593e6c0647713f66960',
        amount: 3,
    },
    {
        address: '0xd86aC5C1b7476D714558CE3e6c544b617D01cc19',
        amount: 1,
    },
    {
        address: '0x65c468cF73d9DbF026d6f9c153609831218FAdD0',
        amount: 2,
    },
    {
        address: '0xd4ae962A77e31dFb1ce4586F7a22b60b67e2BB3D',
        amount: 3,
    },
    {
        address: '0x37161D9f0b6de887726612188Fd1a24aeBC40c61',
        amount: 16,
    },
    {
        address: '0x089a1f8D2CA16Af3C72cF85904a445c3E01B73C7',
        amount: 1,
    },
    {
        address: '0xdd4e2d6887b7ca91d80cA822A40348bED808683E',
        amount: 3,
    },
    {
        address: '0x8752AFBf7f4DE8DadeB6963d8a82D366392E3DE5',
        amount: 2,
    },
    {
        address: '0xd9deC1E44313CAc707E07444fA139AFD2c4785C5',
        amount: 1,
    },
    {
        address: '0x7d428bc535667e4c2bAEefBc6d4DA7b95CFE931e',
        amount: 1,
    },
    {
        address: '0xb0Bcfde547E15c48fEFEEd2Cc021F030dE4f317E',
        amount: 1,
    },
    {
        address: '0x89F58481E63AbefFAD28999098a537FF380B0302',
        amount: 4,
    },
    {
        address: '0x7C20Cf5144DBF1eb96Ca1e4BB37770B16681f951',
        amount: 1,
    },
    {
        address: '0x839F3927B0aA7A5B172dC1E47c7f1A9e4679e214',
        amount: 5,
    },
    {
        address: '0xd019d0954D0A2916F08cF316AD0A9131b65cBF61',
        amount: 1,
    },
    {
        address: '0x6c957b38928DDCDE3B68e9847AcBe26d5041F780',
        amount: 2,
    },
    {
        address: '0x4c25d10156840dD2D9Cc3Aa61569EAbA243d9581',
        amount: 1,
    },
    {
        address: '0xc942967903A159270eE94047964290e40eE2BCC2',
        amount: 2,
    },
    {
        address: '0xb279398395d66e21085fa6cC94A07baA046f4804',
        amount: 1,
    },
    {
        address: '0x8874EE80f28cD0490a2616eE44BCeF02eD47955c',
        amount: 1,
    },
    {
        address: '0x37a8fD5f7f23fdff86eFC05b0EBc534A85D16280',
        amount: 5,
    },
    {
        address: '0x0D0F6B0923909bA5B841590a85910d0AC9855c7d',
        amount: 3,
    },
    {
        address: '0xDA8Ec5e9fC40AB5c350671FD9B29b8c2109200E0',
        amount: 1,
    },
    {
        address: '0x3Acb2Ce265b53B2BA3481537169B674d83d4e038',
        amount: 3,
    },
    {
        address: '0xdb2e52bab29c0b9ab4ce74fe7062e9a56fc3c351',
        amount: 4,
    },
    {
        address: '0xC3448B19B8bf67F32509C3cC0473E4f4Af672218',
        amount: 1,
    },
    {
        address: '0x758682BdCE0043806c38a49AEC47a23590f67B42',
        amount: 1,
    },
    {
        address: '0x6b5908f41daf12f58ec646960187ef9f25d5c66c',
        amount: 1,
    },
    {
        address: '0xbc53777491326eefb8da2fe9318ac9096c8756dc',
        amount: 1,
    },
    {
        address: '0xe7D36432f0D9CACef33fb393a3Dee7bA24B31211',
        amount: 1,
    },
    {
        address: '0x8018723d46BB75A3A0470E930379F779826E5Acb',
        amount: 2,
    },
    {
        address: '0x735771f8B1a5C7296392f411ef1D85660E0D1A64',
        amount: 1,
    },
    {
        address: '0xf1d17Ae2169a12BB484D18D4076A467802c3DAe8',
        amount: 1,
    },
    {
        address: '0x94494b8be97d4137bc9B4252c975C3e8e2dc1c32',
        amount: 1,
    },
    {
        address: '0x55C616585c3f36C88AfA06874010C106bD567156',
        amount: 1,
    },
    {
        address: '0x79C5146BD916944B4f4Aee4c2447644BE2B78e0f',
        amount: 1,
    },
    {
        address: '0x1EA565809cc3883548f2e5f7A429E0Cc88fdD6FB',
        amount: 1,
    },
    {
        address: '0xB4fc390675894c7f1dc0cC28Dd932E450671aA53',
        amount: 1,
    },
    {
        address: '0x20F435af76699629FE55C4AC342D33013a0e6677',
        amount: 1,
    },
    {
        address: '0x4Cc8C9a45B953a1922D8700e7cf4c0489D0b4154',
        amount: 1,
    },
    {
        address: '0x6632d358Fb4215D8EFB80c0C7c3bbec0aE603852',
        amount: 1,
    },
    {
        address: '0x37b007c8eDCFC893d92C177002394c0909954692',
        amount: 1,
    },
    {
        address: '0x57A9ee01f171506F65D36a43319Cddc8673C5363',
        amount: 1,
    },
    {
        address: '0x47950412023A2B33ED1a1b289d2D463a2C0EF4B5',
        amount: 1,
    },
    {
        address: '0xf05557AEE7B1e3650bCB2d3409FBAABfB8885E10',
        amount: 1,
    },
    {
        address: '0x5BBC0651bbCC5a1d03f8C5d637986E0B840B1299',
        amount: 1,
    },
    {
        address: '0xf51d5bF7c8c2B47885c88fb66A70d8f00324Db76',
        amount: 1,
    },
    {
        address: '0x408B4398aEa9245AF20CC71c9e39f4C0a4Dd909A',
        amount: 1,
    },
    {
        address: '0x6AA33d1F92f2b64db7Be6d8190390091dC69c8Ff',
        amount: 1,
    },
    {
        address: '0x6420534d7491d3d8947E0DB59d1469212754FaCd',
        amount: 1,
    },
    {
        address: '0xaCb47BE13E50124C7ec22405b608d0e895aB6F3c',
        amount: 1,
    },
    {
        address: '0x8D31996bA51ae575Ee5b60428380DD264449CA06',
        amount: 1,
    },
    {
        address: '0xdae3C269bE6c8A5FE81d54e99Bd974B39874eca7',
        amount: 1,
    },
    {
        address: '0x004BB583EA1E4f26Bf9ded5A6ccD0c3F6BC0d54f',
        amount: 1,
    },
    {
        address: '0x618B94F806087FC584056F088700c74Ff46692D3',
        amount: 1,
    },
    {
        address: '0xCCeA0F6aa13B0ae284f8bc8E0fe39346bC463a8e',
        amount: 1,
    },
    {
        address: '0xf7680b5125e6ca9CD840A2F759f0F49504774cE7',
        amount: 1,
    },
    {
        address: '0x63dED784c8Da63A79eE47f9a53BcB1BAD1d9F3e0',
        amount: 1,
    },
    {
        address: '0xCfC8bEB98622Fc5c0a50Ed89dceaA026E04C7e09',
        amount: 1,
    },
    {
        address: '0x8aaEB805dD01016E13216CcE9cC8a3D76dE57eA3',
        amount: 1,
    },
    {
        address: '0x94843434993f2EFc1A8fdC47f713c0f97F138e03',
        amount: 1,
    },
    {
        address: '0xd03e5EF71e71B3a48E6ddbB167Bf0EFfB8bb0F3C',
        amount: 1,
    },
    {
        address: '0x30DA27c72C3BA2fF0227A64EBaa280D6c4b4d72b',
        amount: 1,
    },
    {
        address: '0x3972D03aFBA79efB38114D7Fe4801820672a5D48',
        amount: 1,
    },
    {
        address: '0xbb0cAE830DB376Cf94002D9ff2E3982fD212f444',
        amount: 1,
    },
    {
        address: '0x7c0ED78Ac57c08199d3505EA8F0863584103995d',
        amount: 1,
    },
    {
        address: '0xb7169D3ed1D0257E12A73Df1D5d89b393eb03cdA',
        amount: 1,
    },
    {
        address: '0xFB8810e2E7E08FC0B47370C340052914074d1f62',
        amount: 1,
    },
    {
        address: '0x4Db84F60b955b8B6b1d5596b466b3B2F9841A111',
        amount: 1,
    },
    {
        address: '0x7cD697041E98C860e64E4Bd41a889b8579753E6f',
        amount: 1,
    },
    {
        address: '0x78529a5325a7CbFe0208A6fE99A829EA28b09946',
        amount: 1,
    },
    {
        address: '0x14d861e5ec605d74ee625bf715596b6b983b70a6',
        amount: 1,
    },
    {
        address: '0x3F8D027b1Fd1D48DA3838b4D9E648605AAD2c0Df',
        amount: 1,
    },
    {
        address: '0xbE5d4B64a38288C54416D075ab1bfbD70e24557e',
        amount: 1,
    },
    {
        address: '0x7356EcE4705bfbd926bc787ccC758FD9406283c0',
        amount: 1,
    },
    {
        address: '0x178CB63Dcdee244f99ab4044dEA2a07d8278F9c6',
        amount: 1,
    },
    {
        address: '0xDd2ebDa8e7BB1f858548Af2999C59F5afB95D709',
        amount: 1,
    },
    {
        address: '0xb66EE72cfA34c557172509A7098ADA1D2a1268eE',
        amount: 1,
    },
    {
        address: '0xD5dB56C342eec84F68Ed59F00368D3fd2B4A0630',
        amount: 1,
    },
    {
        address: '0x4cB75146e98562C9d79b31649C6C739e4DCB7CD5',
        amount: 1,
    },
    {
        address: '0xD07Add160f117cE03e09083e12aF4AFa8DD1853C',
        amount: 1,
    },
    {
        address: '0x0D50bb5b6BCEcC8a51898DeFBe2E9a89a82fEA0A',
        amount: 1,
    },
    {
        address: '0x1d7ad01BA1b4E1dAa20bD4C0DE4D495CCeeb2442',
        amount: 1,
    },
    {
        address: '0x6b1551404b7F34c656d32461BD9F576C4094c33D',
        amount: 1,
    },
    {
        address: '0xd9014e617D0F63D5fA99B87d3afe700645c5eb94',
        amount: 1,
    },
    {
        address: '0xc693f4Bc23A5193B6F0cB7B3284EcF04Ea854F72',
        amount: 1,
    },
    {
        address: '0x2FEB8c9FC682b5950ef53C7D25c73ff654529bf3',
        amount: 1,
    },
    {
        address: '0x33E358FFDeAB16e0B06Ac1893F6a6F0A6a85536a',
        amount: 1,
    },
    {
        address: '0x90d04486E516Ecc4B2FA0DD25714D3D0e24158cA',
        amount: 1,
    },
    {
        address: '0xd2eDbF5468C88ae2beB4885479ca08932821f9a9',
        amount: 1,
    },
    {
        address: '0x124Ca9B33C4595F5EBefaCF7c095791fb02FEcEE',
        amount: 1,
    },
    {
        address: '0x9997058b832f7e2DCD99AFd183699eB3F448637d',
        amount: 1,
    },
    {
        address: '0xd262dA31e589D55ac9309F91D36354A5A620b172',
        amount: 1,
    },
    {
        address: '0x39BcC119e650aA88fe417d23BF08D86597416Fb2',
        amount: 1,
    },
    {
        address: '0xa57dB8e7Fa073F1fE8E0636Ad11540034a9c3Aca',
        amount: 1,
    },
    {
        address: '0xB75dF1B6F8cbBb55DD0418C0139Ed73Cc17360B2',
        amount: 1,
    },
    {
        address: '0x830b179E70e4823c39058eD5B78f243fF9242A04',
        amount: 1,
    },
    {
        address: '0x38dAEa6f17E4308b0Da9647dB9ca6D84a3A7E195',
        amount: 1,
    },
    {
        address: '0xEdd6d24c3cf85ba76547e2409DAB800Bc9b13E05',
        amount: 1,
    },
    {
        address: '0xF41F12C3914E9b3cD3Da98F05c33795b5436f85d',
        amount: 1,
    },
    {
        address: '0x2cBd62E5061b2d114fbDB214922085A7015e87E0',
        amount: 1,
    },
    {
        address: '0x7003AaCb28c3b09A2dD123C87D2D44853c905205',
        amount: 1,
    },
    {
        address: '0x33657232bBF4516f88c5513674ffcC87b2b6d30e',
        amount: 1,
    },
    {
        address: '0xbda60Cf87122df83Ef293bD591958D80F69E7ef7',
        amount: 1,
    },
    {
        address: '0xa181F3c8CB270428da4B32CeFe020Bf342F38820',
        amount: 1,
    },
    {
        address: '0x001461c431645AE6f6279054B6572BcBf66D2a91',
        amount: 1,
    },
    {
        address: '0x18fCc0f5B2Cb7c571CA0344B50563Ca6c33254Ab',
        amount: 1,
    },
    {
        address: '0x773e41b7421a5B1ac57FD2C6278508A2fA9Ca86e',
        amount: 1,
    },
    {
        address: '0xe821af1C3046250391d7331c87674e45dF702A4E',
        amount: 1,
    },
    {
        address: '0x7c5bf55A458611d29713e1D87ECd115Da9a32801',
        amount: 1,
    },
    {
        address: '0x3f841284fF188c01b7c3ce98877F96637AF5a24C',
        amount: 1,
    },
    {
        address: '0x39480bd4566496ea4F283AF164f8c3eEC563d70B',
        amount: 1,
    },
    {
        address: '0xCBD5d2D7d72B1845e3F0dF27958db64C1b2537D5',
        amount: 1,
    },
    {
        address: '0x605F47B959b8A77d1aef501DFE30983D3796e266',
        amount: 1,
    },
    {
        address: '0x235C7a8674932E427986e0722Fd71e43eE2B4778',
        amount: 1,
    },
    {
        address: '0xA9F2e41aFc4bd715955Bae2EAfeb14a44D5C99B6',
        amount: 1,
    },
    {
        address: '0x91140d9261A5b8f8468A3bF9cCE09661FbAda63c',
        amount: 1,
    },
    {
        address: '0xEe1dd1f6c3059efe6AEcCe39A581113022cD1E75',
        amount: 1,
    },
    {
        address: '0x47bfB7013C83C63ae1142B730C6f91DfBe430675',
        amount: 1,
    },
    {
        address: '0xBc1F9282C83ba8f5562c7B6AcF5E81d424F0c74F',
        amount: 1,
    },
    {
        address: '0xA44600A05951954BE341299c4c4c0b169DEF3f75',
        amount: 1,
    },
    {
        address: '0x6EC3523c84d0067A4B477057b6225991c5d1B6cc',
        amount: 1,
    },
    {
        address: '0xcE32C2E38baEa8e7Bb596E3c3252515C9B545582',
        amount: 1,
    },
    {
        address: '0xF724BF21312222585615d7804d3B08966f94395B',
        amount: 1,
    },
    {
        address: '0xA120Cc0b555B7d914E487b1E892C714569023Ce4',
        amount: 1,
    },
    {
        address: '0x4b3D026dDcac0e0cD0FD7e8B58a90D00866dE7c2',
        amount: 1,
    },
    {
        address: '0xe9bb02632632557D3759045e7c680362AE4ac4cc',
        amount: 1,
    },
    {
        address: '0x9D5270650E5Cf29293eA3dbDF742372ecbC83145',
        amount: 1,
    },
    {
        address: '0x2E70F3e653A4FEF6B3f20b67BcE67A59DEA2b6a4',
        amount: 1,
    },
    {
        address: '0xe46383b3647542932064FD85939c81C9c441701e',
        amount: 1,
    },
    {
        address: '0x3034A2D94B3EC13e26032A7D724737f088023757',
        amount: 12,
    },
    {
        address: '0x18b1d01DC2AFbCca39cEbbedFFeEF2B4b986D54D',
        amount: 4,
    },
    {
        address: '0x55A00Cd1EfeE3eA390F6A7351fa9E54c8EbfAb19',
        amount: 8,
    },
    {
        address: '0x9e6834070a4b83E4477328d2a0751D40305f5Dd4',
        amount: 2,
    },
    {
        address: '0x0bCA4DC69315E1Cc0CE9Ff030c26FA3A5f3fb897',
        amount: 8,
    },
    {
        address: '0xc1baF0dF8eCc19cC83d21cA740C6C4ACC08b3Ab7',
        amount: 2,
    },
    {
        address: '0x8e7347C123b0261271ac3cD6A2e84A1517fea333',
        amount: 6,
    },
    {
        address: '0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec',
        amount: 4,
    },
    {
        address: '0x429AD64Fec22Bc0616D56ED2A48D32dBc9C8D0D6',
        amount: 3,
    },
    {
        address: '0x3434174182F26372Cc09aF09eA468b6623B40094',
        amount: 1,
    },
    {
        address: '0x6059A9D75429f85cea103Fa8Ea104410191BdDFA',
        amount: 2,
    },
    {
        address: '0x0f1ee77Dc47Bbf997EBA7D065A2094e08c971ac6',
        amount: 1,
    },
    {
        address: '0xD02d00ffe43c8b29C17a4954B3CBe342B630995C',
        amount: 2,
    },
    {
        address: '0x2a7297399739B4d8707C9591d5A0B23E90178b97',
        amount: 3,
    },
    {
        address: '0x68F7dD8df5096C2bA74b44C940dCE629BD519A37',
        amount: 1,
    },
    {
        address: '0xD91E5dc5D75Fcb5FDe4A23A1DaF148CfBE07Fe70',
        amount: 2,
    },
    {
        address: '0x182d4DE1ADc7F2ad5be4cD6C327C3C4294A432E4',
        amount: 1,
    },
    {
        address: '0x2619175ed2AA5584b4C64CC3BC8b78998D97CaA4',
        amount: 8,
    },
    {
        address: '0x77F98948eCF223749a6c3Ad2F01d00931e97Fd35',
        amount: 1,
    },
    {
        address: '0x05A654F1776036f3573a585B20c3BDC035178BCB',
        amount: 2,
    },
    {
        address: '0x78b3Fb4460073A387E82541543CC471e4c619d67',
        amount: 1,
    },
    {
        address: '0x439fc557509E8544972F0163e49DB9944270B48C',
        amount: 2,
    },
    {
        address: '0x19beefF9d61301084563a59A04eea8Fd3a7Dba02',
        amount: 1,
    },
    {
        address: '0x426709Ab969F9901654942af0eAd1966Ad111a9D',
        amount: 1,
    },
    {
        address: '0x304adFaaE4C9663c40B50d0eac3690234DE065C5',
        amount: 1,
    },
    {
        address: '0x3c0b3D5b7B87A693F6a82e2f76Cc37AA5C5bC034',
        amount: 1,
    },
    {
        address: '0xcaBaa3310b1b0E01559FA397C46B41276Ae6F8A9',
        amount: 1,
    },
    {
        address: '0x1eF2e7c3F0Dc2E713c92AD63Dc528364750Fe55e',
        amount: 1,
    },
    {
        address: '0x66Aa81906d7773445f248eAB1153E6714d1B0Baf',
        amount: 1,
    },
    {
        address: '0xE6cB7CbB8178d3a6D4f0a186E1BD056411A419E7',
        amount: 2,
    },
    {
        address: '0xd795cEd0dcB04F570F2Ea3525607FBe54eeeB227',
        amount: 2,
    },
    {
        address: '0xFF2dce2F42D27dD9a0F03070F7471278a4a5C001',
        amount: 1,
    },
    {
        address: '0x1b7c907A1804eb521826E99386c4077df8E18b84',
        amount: 1,
    },
    {
        address: '0xD8e771765666F00bAABD73b3BE2A01d4415bb066',
        amount: 1,
    },
    {
        address: '0x397419BfbdFcd73d3575f61dB8190c327253C2F3',
        amount: 2,
    },
    {
        address: '0x61392b7651D0f00D5b31F9C07c3a4A6B9EC39324',
        amount: 1,
    },
    {
        address: '0xb8354a4346f6A2980dC9Eb817949504A33719022',
        amount: 2,
    },
    {
        address: '0x2a8B990089a556Ed5B7777e2AC30d921F6Ce47f1',
        amount: 1,
    },
    {
        address: '0x6a339FFa10f11b10078bE76631de3B5018F4374B',
        amount: 1,
    },
    {
        address: '0x4ca4c1E1dd9B26256a451922D4C4bA3E6ee51b09',
        amount: 1,
    },
    {
        address: '0x4f5e0D5Efe14e7CF9b5a1D884CA0c280f3dD99FE',
        amount: 1,
    },
    {
        address: '0x8536dA189dfB8213E504B65E64bF703928183fc7',
        amount: 1,
    },
    {
        address: '0x964999051adCEBC0426C762D26053680241927f6',
        amount: 1,
    },
    {
        address: '0x63d93C368eAc117def04c7775C655F8c3FB53390',
        amount: 1,
    },
    {
        address: '0xA52b42CaF60FdC20d4eAD70aD2288DdE7126F767',
        amount: 1,
    },
    {
        address: '0x4a94f4ad9EF7FF5c31B1401ADca2E9740bb8c2a2',
        amount: 1,
    },
    {
        address: '0x94c51B53bE1166ACCeC179Bb2B8F038D889df71a',
        amount: 3,
    },
    {
        address: '0x0A9491F1D79165f9749C6E75D2289355B2CeACC1',
        amount: 1,
    },
    {
        address: '0xc0300f91a3826306dd0005e640FB7F7E106aBef5',
        amount: 1,
    },
    {
        address: '0xC59D2F438fF4aE25FB6c200c889ec6b73a2BBE84',
        amount: 1,
    },
    {
        address: '0x1d0c605D68271b7F397799071d8CE023981Ca7FA',
        amount: 1,
    },
    {
        address: '0xA13C34Ed830ab0988A4F366A03075E8a2F923004',
        amount: 1,
    },
    {
        address: '0x2cC7bE972E2152C5D7f4150678901C8C2b6Fdd0b',
        amount: 2,
    },
    {
        address: '0x9970733beFDD0CD9c1ffb7d02B80A32c6aA0a62b',
        amount: 1,
    },
    {
        address: '0x22cf22e8B61e7F4B826c882F1d151Ed571f5C5f6',
        amount: 1,
    },
    {
        address: '0x50cEFd3B67321944c130a14b19b0be260cF3A406',
        amount: 1,
    },
    {
        address: '0x8197d009DAf7eD8a6fBCd4AF792BBED7F75ACc04',
        amount: 1,
    },
    {
        address: '0xd964584ab8731aa127f429150fb6aafc9f63182f',
        amount: 1,
    },
    {
        address: '0x2086feddd7143d8a012223df643a151317bf4de8',
        amount: 1,
    },
    {
        address: '0x6cd95c7dcfaa79086efea4bce6e96f920e06b18b',
        amount: 1,
    },
    {
        address: '0x0bdb2e0ee9d704a3ede7606bbf5de0e924c5ba74',
        amount: 1,
    },
    {
        address: '0xd4d14ca8e2c06b96ee8760054bb096ec897774c4',
        amount: 1,
    },
    {
        address: '0x8364d342e3b5252258f52e2d574ac4284f515b49',
        amount: 3,
    },
    {
        address: '0x444444Cc7FE267251797d8592C3f4d5EE6888D62',
        amount: 2,
    },
    {
        address: '0x6059A9D75429f85cea103Fa8Ea104410191BdDFA',
        amount: 2,
    },
    {
        address: '0x8531f6D1A8d38dbE5903516c7E313662816c5807',
        amount: 2,
    },
    {
        address: '0x8531f6D1A8d38dbE5903516c7E313662816c5807',
        amount: 2,
    },
    {
        address: '0x27E82Ba6AfEbf3Eee3A8E1613C2Af5987929a546',
        amount: 2,
    },
]


async function signWhitelist(account: string, verifyingContract: string, amount: number = 1) {
    const [sender] = await ethers.getSigners();

    const TypesTrader = {
        Whitelist: [
            { name: "account", type: "address" },
            { name: "amount", type: "uint256" },
        ],
    };

    const chainId = 1; // goerli - 5, mainnet - 1, rinkeby - 4

    return await signMessage(
        sender,
        {
            chainId,
            verifyingContract,
        },
        TypesTrader,
        { account, amount },
    );
}

async function main() {
    const [sender] = await ethers.getSigners();
    console.log("Sender: ", sender.address);

    // console.log("start deploy token");
    // We get the contract to deploy
    const TokenImplementation = await ethers.getContractFactory("MusesOfPleasure");
    const tokenImpl = await TokenImplementation.deploy(
        "Muses of Pleasure", // name
        "MoP", // symbol
        `ipfs://${ipfsHash}/`, // uri
        16, //  how much a minter can mint at a time.
        10000, // supply cap
    );
    await tokenImpl.deployed();
    console.log("token deployed", tokenImpl.address);

    // const tokenImpl = await ethers.getContractAt("MusesOfPleasure", '0x7Cb32c0F409Ad6D821dA67b04E0C79F0B8453453');
    // await tokenImpl.connect(sender).setBaseURI(`ipfs://QmeYYBJrF5GX4yLenqRhxUjAmkS3akLm5ATJVYp9hmrA58/`);

    const pinata = pinataSDK(
        "e570cac578ba3585a96e",
        "5892be7cf9e86ca25d27afcee520eb898a9dfd5c43e5d8aba4baa79c1215a386",
    );

    console.log("start deploy trader");

    // We get the contract to deploy
    const TraderImplementation = await ethers.getContractFactory("TokenTrader");

    const traderParams = [
        tokenImpl.address, // collection
        parseUnits("0.069"), // price
        2 * day, // whitelistDuration
        sender.address, // signer him generate the signs
    ];

    const traderImpl = await TraderImplementation.deploy(...traderParams);
    await traderImpl.deployed();
    console.log("trader deployed", traderImpl.address);

    console.log("setMinter");
    const setMinterResult = await tokenImpl.setMinter(traderImpl.address);
    await setMinterResult.wait();

    const whitelistObject: Record<string, { signature: Signature; amount: number }> = {};
    await pinata.testAuthentication();

    for (const wl of whitelist) {
        const sig = await signWhitelist(wl.address, traderImpl.address, wl.amount);
        whitelistObject[wl.address] = {
            signature: sig,
            amount: wl.amount,
        };
    }

    const resPinJSON = await pinata.pinJSONToIPFS(whitelistObject);
    console.log("resPinJSON", resPinJSON);

    console.log("setSigListIpfsHash");
    const setSigListIpfsHashResult = await traderImpl.setSigListIpfsHash(resPinJSON.IpfsHash);
    await setSigListIpfsHashResult.wait();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
