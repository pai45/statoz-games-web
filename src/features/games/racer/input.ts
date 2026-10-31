import {clamp,emptyInput,type Input} from './engine';
export type Action='left'|'right'|'brake'|'boost'|'gas';
export const keyMap:Record<string,Action>={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'gas',KeyW:'gas',ArrowDown:'brake',KeyS:'brake',Space:'boost',ShiftLeft:'boost',ShiftRight:'boost'};
/** Each physical key or pointer owns its hold; releasing one never clears another. */
export class RacerInput{
 private owners=new Map<string,Action>();
 private analog=0;
 hold(owner:string,action:Action){this.owners.set(owner,action);}
 release(owner:string){this.owners.delete(owner);}
 steer(value:number){this.analog=clamp(value,-1,1);}
 clear(){this.owners.clear();this.analog=0;}
 read():Input{const result=emptyInput();result.steer=this.analog;for(const action of this.owners.values()){if(action==='left')result.steer--;else if(action==='right')result.steer++;else result[action]=true;}result.steer=clamp(result.steer,-1,1);return result;}
}
