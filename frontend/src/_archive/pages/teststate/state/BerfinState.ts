import { create } from 'zustand'
import { BaseZustandState, ZustandUtils } from '@/_zustand/Zustand'
import { Signer } from '@/api/models/Signer'

export interface  BerfinState extends BaseZustandState {
    id:string,
    count:number,

    setId: (id: string) => void
    setCount: (count: number) => void
}





export const BerfinStateActions = (set:any, get:any /** zustand set get */) => ({
    id: 'BerfinState',
    tabState: 'signerList',
    count: 0,
    

    setId(id: string) {
        ZustandUtils.setState(set, get, (state: BerfinState) => {
          state.id = id
        })
      },

      setCount(count: number) {
        ZustandUtils.setState(set, get, (state: BerfinState) => {
          state.count = count
        })
      },
      
      
  })


export const useBerfinState = create<BerfinState>((set, get) => (BerfinStateActions(set, get)))

export default useBerfinState

