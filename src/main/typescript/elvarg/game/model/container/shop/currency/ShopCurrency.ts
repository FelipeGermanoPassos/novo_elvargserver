interface ShopCurrency {
    getName(): string;
    getAmountForPlayer(player: any): number;
    decrementForPlayer(player: any, amount: number): void;
    incrementForPlayer(player: any, amount: number): void;
    }
    
    class CoinsCurrency implements ShopCurrency {
    getName(): string {
    return "Coins";
    }
    getAmountForPlayer(player: any): number {
    // implementation
    return 0;
    }
    decrementForPlayer(player: any, amount: number): void {
    // implementation
    }
    incrementForPlayer(player: any, amount: number): void {
    // implementation
    }
}