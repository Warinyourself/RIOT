import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators'
import { Coin } from '@/types/dto/crypto'
import store from '@/store'
import axios from 'axios'

export interface CryptoState {
  coins: Array<Coin>;
  coinsDefaultSequence: string[];
}

@Module({ dynamic: true, store, name: 'crypto' })
class Crypto extends VuexModule implements CryptoState {
  coins = []
  coinsDefaultSequence = ['bitcoin', 'ethereum', 'cardano', 'neo']

  get getCoinsSequence() {
    return (sequence?: string[] | undefined): Array<Coin> => {
      let innerSequence = sequence || this.coinsDefaultSequence
      innerSequence = innerSequence.length ? innerSequence : this.coinsDefaultSequence
      return this.coins.filter((coin: Coin) => innerSequence.includes(coin.id))
    }
  }

  @Mutation
  SET_CRYPTO_STATE(change: { key: string, value: any }) {
    (this as any)[change.key] = change.value
  }

  @Action({ commit: 'SET_CRYPTO_STATE' })
  async fetchCoins() {
    const response: any = await axios('https://api.coinmarketcap.com/v1/ticker/')
    return { key: 'coins', value: response.data }
  }
}

export const CryptoModule = getModule(Crypto)
