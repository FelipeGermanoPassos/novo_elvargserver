
export enum ShopCurrencies {
    COINS = 'CoinsCurrency',
    BLOOD_MONEY = 'BloodMoneyCurrency',
    CASTLE_WARS_TICKET = 'CastleWarsTicketCurrency',
    POINTS = 'PointsCurrency'
}

class ShopCurrency { }

class CoinsCurrency extends ShopCurrency { }

class BloodMoneyCurrency extends ShopCurrency { }

class CastleWarsTicketCurrency extends ShopCurrency { }

class PointsCurrency extends ShopCurrency { }

function get(shopCurrencies: ShopCurrencies) {
    switch (shopCurrencies) {
        case ShopCurrencies.COINS:
            return new CoinsCurrency();
        case ShopCurrencies.BLOOD_MONEY:
            return new BloodMoneyCurrency();
        case ShopCurrencies.CASTLE_WARS_TICKET:
            return new CastleWarsTicketCurrency();
        case ShopCurrencies.POINTS:
            return new PointsCurrency();
        default:
            throw new Error(`Invalid shop currency: ${shopCurrencies}`);
    }
}