"""Original pixel athlete/equipment construction. No input raster or traced sprite.
Run from Future Games Web. Source is this editable geometry and palette file.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
import math, json, hashlib
from retro_hoops_character import render_character,RIG

ROOT=Path.cwd(); OUT=ROOT/'public/games/retro-hoops/authored-v7'; OUT.mkdir(parents=True,exist_ok=True)
W,H=144,128
CLIPS={'run':12,'dribble-body':12,'defend':8,'brake':4,'dribble-arm':18,'backpedal':8,'pivot':4,'dribble-switch':72,
       'shot':30,'throw':12,'finish':24,'jump-block':24,'reach':15,'recover':12,'collect':6,'fake':12,'catch':12}
POSES=['d-push','d-low','d-down','s-ready','s-rise','s-release','s-follow','p-pass-gather-left','p-pass-extend-left','a-reach','a-overhead','carry-low','carry-front','dunk-gather','dunk-contact','land-recover','neutral-a','neutral-b']
PALETTES={'navy':{'skin':['#59351f','#a66431','#d9924c','#f8c679'],'short':['#07356c','#1266c2','#68b7ff'],'shirt':['#073d80','#0870cc','#299df3','#91d5ff']},
 'amber':{'skin':['#6d4028','#b67b49','#e9ac72','#ffdb9b'],'short':['#691d29','#ba283d','#f86b6b'],'shirt':['#751d30','#bd2940','#ef4854','#ffaaa0']}}
frames=[];images={}
def render(team,kind,index=0,count=1,view='side'):
 return render_character(team,kind,index,count,view,PALETTES)

def save(key,im,anchors,team,clip,index,view,facing):
 images[key]=im;frames.append({'key':key,'team':team,'clip':clip,'frame':index,'view':view,'facing':facing,'anchors':anchors,'pixelHash':hashlib.sha256(im.tobytes()).hexdigest()})
for team in PALETTES:
 for kind,count in list(CLIPS.items())+[(p,1)for p in POSES]:
  views=['side','front','back']if kind in ['run','dribble-body','defend','backpedal','neutral-a','neutral-b','carry-front','dribble-arm','dribble-switch']else['side']
  for i in range(count):
   for view in views:
    im,anchors=render(team,kind,i,count,view);pose=kind+('-'+str(i).zfill(2)if kind in CLIPS else '')+(''if view=='side'else '-'+view)
    for facing in ['source','mirrored']:
     mirrored=facing=='mirrored';frame=ImageOps.mirror(im).transform((W,H),Image.Transform.AFFINE,(1,0,-1,0,1,0))if mirrored else im
     a=json.loads(json.dumps(anchors))
     if mirrored:
      for k,v in a.items():
       if isinstance(v[0],list):a[k]=[[144-q[0],q[1]]for q in v]
       else:a[k]=[144-v[0],v[1]]
     save(f'{team}-{pose}-{facing}',frame,a,team,kind,i,view,facing)
# Original ball, asymmetric perspective baskets. No historical rasters loaded.
ball=Image.new('RGBA',(11,11));d=ImageDraw.Draw(ball);d.ellipse((0,0,10,10),fill='#e68b28',outline='#3d271d');d.arc((1,0,9,10),70,270,fill='#ffbd54');d.line([(1,5),(9,5)],fill='#54301e');d.arc((2,-2,7,12),260,100,fill='#54301e');images['ball']=ball
for side,size in [('left',(47,75)),('right',(92,75))]:
 im=Image.new('RGBA',size);d=ImageDraw.Draw(im);x=23 if side=='left'else 5
 d.polygon([(x-14,7),(x+12,3),(x+12,32),(x-14,36)],fill='#a4aaa0',outline='#282a2c');d.line([(x-11,9),(x+10,6),(x+10,30),(x-11,33),(x-11,9)],fill='#e7e3c4',width=2)
 d.rectangle((x-3,22,x+7,32),outline='#9f3930',width=2);d.line([(x,44),(x+10,48),(x+18,43)],fill='#e9e1bb',width=2)
 d.line([(x,35),(x+3,47),(x+12,50),(x+18,35)],fill='#e9e1bb');d.ellipse((x-3,32,x+19,38),outline='#df6334',width=3);images[side]=im
cols=16;pageSize=512;regions={};atlases=[];unique={};imageIds={}
for key,im in images.items():
 digest=(im.size,hashlib.sha256(im.tobytes()).hexdigest());imageIds[key]=digest
 if digest not in unique:unique[digest]=im
for start in range(0,len(unique),pageSize):
 rows=math.ceil(min(pageSize,len(unique)-start)/cols);atlases.append(Image.new('RGBA',(cols*W,rows*H)))
locations={}
for i,(digest,im)in enumerate(unique.items()):
 page=i//pageSize;j=i%pageSize;x=j%cols*W;y=j//cols*H;atlases[page].alpha_composite(im,(x,y));locations[digest]=[x,y,*im.size,page]
for key,digest in imageIds.items():regions[key]=locations[digest]
names=[]
for i,atlas in enumerate(atlases):
 name=f'family-{i}.png';names.append(name);atlas.save(OUT/name,optimize=True)
manifest={'version':'7.0.0','classification':'original authored pixel geometry; no reference rasters','approval':'draft-pending-visual-review','sourceCode':'scripts/build-retro-hoops-authored.py','sourceCodeSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'nativeTimingRecovered':False,'rig':RIG,'anatomySource':'scripts/retro_hoops_character.py','anatomySourceSha256':hashlib.sha256((ROOT/'scripts/retro_hoops_character.py').read_bytes()).hexdigest(),'canvas':[W,H],'feet':[72,116],'atlases':names,'regions':regions,'clips':CLIPS,'palettes':PALETTES,'frames':frames,'atlasHashes':{name:hashlib.sha256((OUT/name).read_bytes()).hexdigest()for name in names}}
(OUT/'manifest.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n')
review=ROOT/'test-results/retro-hoops-character-v7';review.mkdir(parents=True,exist_ok=True)
sheet=Image.new('RGB',(12*W,10*H),'#393c34')
for row,kind in enumerate(['run','dribble-body','defend','shot','throw','finish','jump-block','fake','recover','catch']):
 count=CLIPS[kind]
 for col in range(12):
  frame=min(count-1,round(col*(count-1)/11));im,a=render('navy',kind,frame,count)
  if kind in ['dribble-body','shot','throw','finish','fake','catch']:
   from retro_hoops_character import arm
   arm(ImageDraw.Draw(im),a['shoulders'][0],a['hands'][0],PALETTES['navy']['skin'],bend=1 if kind in ['shot','finish']else -1)
  sheet.paste(im,(col*W,row*H),im)
sheet.save(review/'player-family.png')
print(json.dumps({'frames':len(frames),'atlasPages':[im.size for im in atlases],'referenceRasterInputs':0,'output':str(OUT)}))

# Small comparison specimens, silhouettes and directional views at native and enlarged sizes.
from retro_hoops_character import arm
selected=['neutral-a','run','dribble-body','defend','shot','throw','finish','jump-block']
specimens=Image.new('RGB',(8*144,3*154),'#343a32');sd=ImageDraw.Draw(specimens)
for row,view in enumerate(['side','front','back']):
 for col,kind in enumerate(selected):
  count=CLIPS.get(kind,1);index=3 if kind in ['run','dribble-body','defend']else 8 if kind=='shot'else 5 if kind=='throw'else 7 if kind=='finish'else 6 if kind=='jump-block'else 0
  im,a=render('navy',kind,index,count,view)
  if kind in ['dribble-body','shot','throw','finish']:
   arm(ImageDraw.Draw(im),a['shoulders'][0],a['hands'][0],PALETTES['navy']['skin'],bend=1 if kind in ['shot','finish']else -1)
  specimens.paste(im,(col*144,row*154+20),im);sd.text((col*144+3,row*154+4),kind+' / '+view,fill='#eee4c8')
specimens.save(review/'specimens.png')
silhouette=Image.new('RGB',(6*144,154),'#ded9bb')
for col,kind in enumerate(['neutral-a','run','defend','shot','throw','jump-block']):
 im,a=render('navy',kind,0,CLIPS.get(kind,1));mask=im.getchannel('A');silhouette.paste('#25282b',(col*144,20,col*144+144,148),mask)
silhouette.save(review/'silhouettes.png')
