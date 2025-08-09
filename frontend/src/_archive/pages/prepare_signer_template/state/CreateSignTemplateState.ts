import { create } from 'zustand'
import { BaseZustandState, ZustandUtils } from '@/_zustand/Zustand'
import { Signer } from '@/api/models/Signer'
import { SignatureInPDF } from '@/api/models/SignatureInPDF'
import { Document } from '@/api/models/Document'

export interface CreateSignTemplateState extends BaseZustandState {
    id:string
    document: Document | null,
    signaturePerPdfId: Record<string, SignatureInPDF[]>,
    signers: Signer[],
    activeSignerId: string,
    tabStateList: string[],
    tabState: string,
    pdfViewPageNumber: number,
    pdfViewClickPosition: {x: number, y: number},
    
    pdfFileName: string | null,

    setId: (id: string) => void
    setDocument: (document: Document) => void
    setSigners: (signers: Signer[]) => void
    
    setTabState: (tabState: string) => void
    getTabStateIndex: () => number
    setPdfViewPageNumber: (pdfViewPageNumber: number) => void
    setPdfViewClickPosition: (pdfViewClickPosition: {x: number, y: number}) => void
    setActiveSignerId: (activeSignerId: string) => void
    setSignaturePerPdfId: (documentPdfIds:  Record<string, SignatureInPDF[]>) => void
    setPdfFileName: (pdfFileName: string | null) => void

  // toSerializeJsonString:() => string
  // toJsonString:() => string
}





export const ClusterDefinitionStoreActions = (set:any, get:any /** zustand set get */) => ({
    id: 'CreateSignTemplateState',
    tabState: 'signerList',
    tabStateList: ["pdfUpload",'signerList','sortSigners', 'positioningSignatures', 'review'],
    document: null,
    signers: [],
    signaturePerPdfId: {},
    
    pdfViewPageNumber: 1,
    pdfViewClickPosition: {x: 0, y: 0},
    activeSignerId: "",
    pdfFileName: null,

    setPdfFileName(pdfFileName: string | null) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.pdfFileName = pdfFileName
        })
      },

    
    setSignaturePerPdfId(signaturePerPdfId:  Record<string, SignatureInPDF[]>) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.signaturePerPdfId = signaturePerPdfId
        })
      },

    setActiveSignerId(activeSignerId: string) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.activeSignerId = activeSignerId
        })
      },

    setPdfViewClickPosition(pdfViewClickPosition: {x: number, y: number}) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.pdfViewClickPosition = pdfViewClickPosition
        })
      },

    setPdfViewPageNumber(pdfViewPageNumber: number) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.pdfViewPageNumber = pdfViewPageNumber
        })
      },

    getTabStateIndex() {
        const tabStateList = get().tabStateList;
        const tabState = get().tabState;
        return tabStateList.indexOf(tabState);
      },
    
    setTabState(tabState: string) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.tabState = tabState
        })
      },
    setId(id: string) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.id = id
        })
      },

      setDocument(document: Document) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.document = document
        })
      },

      setSigners(signers: Signer[]) {
        ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
          state.signers = signers
        })
      },

      
      
      
  
    // updateNode(node: MedClusterNode) {  
    //   ZustandUtils.setState(set, get, (state: CreateSignTemplateState) => {
    //     state.project.cluster.serializedNodes = state.project.cluster.serializedNodes.map((n:any )=> {
    //       return n.id == node.id ? node : n
    //     })
    //   })
    // },
    


  })


export const useCreateSignTemplateState = create<CreateSignTemplateState>((set, get) => (ClusterDefinitionStoreActions(set, get)))

export default useCreateSignTemplateState

