// Original TRK files store ordinary straight roads on terrain slopes.
// IDs 182–185 describe engine-generated slope geometry, not saved road tiles.
export function canonicalTrackBytes(raw) {
 const next=Array.from(raw);
 for(let i=0;i<900;i++)if(next[i]>=182&&next[i]<=185)next[i]=next[i]%2===0?4:5;
 return next;
}
