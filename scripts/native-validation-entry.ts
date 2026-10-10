// GPL-3.0-only. Uses the project's pinned PlayStunts reconstruction unchanged.
import {analyzeRoute} from '../vendor/playstunts/lib/physics/route-analysis.ts';
import records from '../vendor/playstunts/public/game/route-records.json';
import vectors from '../vendor/playstunts/public/game/route-vectors.json';
import objects from '../vendor/playstunts/public/game/track-objects.json';
export function check(raw:number[],details=false){
 const result=analyzeRoute(raw,records,vectors,[],objects,undefined,{sample:false});
 const error=result.route?.error??result.terrainError?.error??0;
 const route=result.route,last=(route?.count??0)-1;
 const previous=last<0?null:{x:route!.columns[last],y:route!.routeRows[last],tile:route!.tiles[last],state:records[route!.tiles[last]].records[route!.directions[last]&15][route!.directions[last]&16?3:4]};
 return {error,location:error?result.location:null,kind:result.terrainError?'terrain':'route',pieces:route?.count??0,previous,...(details&&route?{nodes:route.columns.map((x,i)=>{const tile=route.tiles[i],record=records[tile].records[route.directions[i]&15];return {x,y:route.routeRows[i],tile,heading:((record[6]+256*record[7])+(route.directions[i]&16?512:0))%1024};})}:{})};
}
