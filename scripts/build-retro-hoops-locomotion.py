"""Editable locomotion family: retained reference torso + authored articulated limbs.
No new commercial-game pixels are extracted. Pose geometry and timing are authored.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps
import math,json,hashlib
ROOT=Path.cwd();ASSETS=ROOT/'public/games/retro-hoops/assets';OUT=ROOT/'public/games/retro-hoops/locomotion-v2';OUT.mkdir(exist_ok=True)
REVIEW=ROOT/'test-results/retro-hoops-movement-v2';REVIEW.mkdir(parents=True,exist_ok=True)
TORSO=[(66,42),(74,42),(77,46),(78,54),(77,76),(65,77),(64,65),(64,58),(58,57),(59,49),(63,45),(68,43),(65,39),(65,32),(69,29),(75,29),(78,34),(77,40),(73,43)]
STEPS=[(16,111),(9,111),(2,111),(-5,107),(-17,100),(-14,93),(1,99),(16,106)]
metadata={'version':'2.0.0','classification':'reference-derived torso; authored limbs and motion','nativeTimingRecovered':False,'canvas':[144,128],'feet':[72,116],'source':'../assets/{team}-neutral-a-source.png','torsoMask':TORSO,'frames':[],'notes':['Retains existing reference head/jersey pixels. New limb geometry, shading, poses, timing and mirrors are authored adaptations, not recovered source frames.','Separate body and dribbling arm layers share ground and shoulder anchors.','No entire-person rotations, scaled character variants or stretch tweening. Torso inclines as one articulated body segment; every limb is posed separately.']}

def mix(a,b,t):return (a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t)
def pt(p):return tuple(round(v)for v in p)
def transform(p,bob=0,lean=10):
 x,y=p;angle=math.radians(lean);dx=x-72;dy=y-78
 return(72+math.cos(angle)*dx-math.sin(angle)*dy,78+math.sin(angle)*dx+math.cos(angle)*dy+bob)
def limb(d,a,b,w1,w2,fill,outline='#1b151a'):
 dx,dy=b[0]-a[0],b[1]-a[1];length=math.hypot(dx,dy)or 1;nx,ny=-dy/length,dx/length
 poly=[(a[0]+nx*w1/2,a[1]+ny*w1/2),(b[0]+nx*w2/2,b[1]+ny*w2/2),(b[0]-nx*w2/2,b[1]-ny*w2/2),(a[0]-nx*w1/2,a[1]-ny*w1/2)]
 d.polygon([pt(p)for p in poly],fill=fill,outline=outline)
def joint(d,p,r,color):x,y=pt(p);d.ellipse((x-r,y-r,x+r,y+r),fill=color)
def hinge(a,b,l1,l2,bend=1):
 dx,dy=b[0]-a[0],b[1]-a[1];dist=max(.01,math.hypot(dx,dy));reach=min(dist,l1+l2-.1);u=(l1*l1-l2*l2+reach*reach)/(2*reach);h=math.sqrt(max(0,l1*l1-u*u));ux,uy=dx/dist,dy/dist
 return(a[0]+ux*u+uy*h*bend,a[1]+uy*u-ux*h*bend)
def shoe(d,ankle,far=False):
 x,y=pt(ankle);d.polygon([(x-4,y-3),(x+2,y-4),(x+5,y+1),(x+10,y+2),(x+11,y+5),(x-5,y+5),(x-6,y+3)],fill='#10161d',outline='#03080e');d.line([(x-4,y+4),(x+9,y+4)],fill='#d2ddd7');d.line([(x-2,y),(x+3,y+1)],fill='#7b9690');d.point((x+1,y-2),fill='#e4e5cb');d.point((x+3,y),fill='#f1e6ce')
def leg(d,hip,ankle,team,far=False,settle=0):
 knee=hinge(hip,ankle,20-2*settle,18-2*settle,1);skin=['#9e512f','#d7824b','#ffbd77'] if far else ['#ad572e','#ed9857','#ffd39a'];kit=['#453086','#6550dc','#8797ff']if team=='navy'else['#9b661b','#d6a236','#f7d05f']
 limb(d,hip,knee,9,7,skin[1]);joint(d,knee,3,skin[1]);limb(d,knee,ankle,6,4,skin[1]);limb(d,mix(hip,knee,.45),mix(hip,knee,.95),3,2,skin[2],skin[2]);limb(d,mix(knee,ankle,.05),mix(knee,ankle,.78),2,1,skin[2],skin[2]);hem=mix(hip,knee,.62);limb(d,hip,hem,12,10,kit[1]);limb(d,mix(hip,hem,.05),mix(hip,hem,.92),3,2,kit[2],kit[2]);d.line([pt(mix(hem,knee,.02)),pt((hem[0]+4,hem[1]-1))],fill=kit[0]);limb(d,mix(knee,ankle,.83),ankle,5,5,'#cbd9c7');shoe(d,ankle,far)
def arm(d,shoulder,wrist,far=False):
 elbow=hinge(shoulder,wrist,17,16,-1);skin=['#8f492e','#d17c4a','#ecad71']if far else['#9d4827','#eb995a','#ffd293'];limb(d,shoulder,elbow,7,5,skin[1]);joint(d,elbow,2,skin[1]);limb(d,elbow,wrist,5,3,skin[1]);limb(d,mix(shoulder,elbow,.25),mix(shoulder,elbow,.85),2,1,skin[2],skin[2]);limb(d,mix(elbow,wrist,.1),mix(elbow,wrist,.85),2,1,skin[2],skin[2]);joint(d,wrist,2,skin[1]);x,y=pt(wrist);d.line([(x,y),(x+3,y+1),(x+3,y+3)],fill=skin[2]);limb(d,shoulder,mix(shoulder,elbow,.4),9,8,'#53545e')
def foot(phase):
 pos=(phase%1)*8;i=int(pos);return mix(STEPS[i],STEPS[(i+1)%8],pos-i)
def body(team,kind,index,count):
 phase=index/count;bob=round(-2*math.sin(phase*4*math.pi));lean=10 if kind in ['run','dribble-body']else 2
 if kind=='defend':bob=5+round(math.sin(phase*4*math.pi));lean=9
 if kind=='brake':bob=[0,2,1,0][index];lean=[6,2,-2,0][index]
 im=Image.new('RGBA',(144,128));d=ImageDraw.Draw(im)
 if kind in ['run','dribble-body']:
  ankles=[(72+foot(phase+.5)[0],foot(phase+.5)[1]),(72+foot(phase)[0],foot(phase)[1])]
 else:
  width=15+7*math.sin(phase*2*math.pi)**2;lift=max(0,math.sin(phase*2*math.pi))*4;ankles=[(72-width,111-lift),(72+width,111-max(0,-math.sin(phase*2*math.pi))*4)]
 if kind=='brake':ankles=[[(54,111),(59,111),(65,111),(69,110)][index],[(88,111),(84,111),(80,111),(76,111)][index]]
 hips=[(68,78+bob),(76,78+bob)];settle=index/3 if kind=='brake'else 0
 # Far limbs remain behind the retained upper body.
 leg(d,hips[0],ankles[0],team,True,settle)
 shoulderFar=transform((76,51),bob,lean);shoulderNear=transform((62,52),bob,lean)
 swing=math.sin(phase*2*math.pi)
 if kind in ['run','dribble-body']:
  elbow=transform((76+12*swing,67),bob,lean);wrist=(elbow[0]+12,elbow[1]-9)
 elif kind=='brake':wrist=transform(mix((91,67),(92,56),settle),bob,lean)
 else:wrist=transform((91,67+4*swing),bob,lean)
 arm(d,shoulderFar,wrist,True)
 source=Image.open(ASSETS/(team+'-neutral-a-source.png')).convert('RGBA');mask=Image.new('L',(144,128));ImageDraw.Draw(mask).polygon(TORSO,fill=255);source.putalpha(Image.composite(source.getchannel('A'),Image.new('L',source.size),mask));torso=source.rotate(-lean,resample=Image.Resampling.NEAREST,center=(72,78));im.alpha_composite(torso,(0,bob));d=ImageDraw.Draw(im)
 leg(d,hips[1],ankles[1],team,False,settle)
 # Restore the jersey's waist edge over the short tops.
 d.line([(66,77+bob),(76,77+bob)],fill='#222127')
 if kind!='dribble-body':
  if kind=='run':elbow=transform((62-12*swing,68),bob,lean);wrist=(elbow[0]+12,elbow[1]-9)
  elif kind=='brake':wrist=transform(mix((49,71),(63,73),settle),bob,lean)
  else:wrist=transform((49,71-4*swing),bob,lean)
  arm(d,shoulderNear,wrist)
 return im,{'bob':bob,'hips':[pt(p)for p in hips],'ankles':[pt(p)for p in ankles],'lean':lean}
def dribbleArm(index):
 phase=index%18;i=phase//6;t=phase%6/6;e=t*t*(3-2*t);offsets=[-12,8,-20,-12];x=offsets[i]+(offsets[i+1]-offsets[i])*e;z=6+30*abs(1-phase/9);wrist=(72+x,116-max(29,z+4));im=Image.new('RGBA',(144,128));arm(ImageDraw.Draw(im),transform((62,52),0,10),wrist);return im,{'wrist':pt(wrist),'shoulder':pt(transform((62,52),0,10)),'ball':[72+x,116-z]}
for team in ['navy','amber']:
 for kind,count in [('run',12),('dribble-body',12),('defend',8),('brake',4),('dribble-arm',18)]:
  for i in range(count):
   im,anchors=dribbleArm(i)if kind=='dribble-arm'else body(team,kind,i,count)
   for facing in ['source','mirrored']:
    result=im if facing=='source'else ImageOps.mirror(im).transform((144,128),Image.Transform.AFFINE,(1,0,-1,0,1,0),resample=Image.Resampling.NEAREST)
    frameAnchors=anchors if facing=='source'else{k:([144-v[0],v[1]]if isinstance(v,(list,tuple))and len(v)==2 and isinstance(v[0],(int,float))else[[144-point[0],point[1]]for point in v]if isinstance(v,(list,tuple))else v)for k,v in anchors.items()}
    name=f'{team}-{kind}-{i:02}-{facing}.png';result.save(OUT/name);metadata['frames'].append({'file':name,'team':team,'clip':kind,'frame':i,'facing':facing,'anchors':frameAnchors,'sha256':hashlib.sha256((OUT/name).read_bytes()).hexdigest()})
metadata['sourceHashes']={team:hashlib.sha256((ASSETS/(team+'-neutral-a-source.png')).read_bytes()).hexdigest()for team in ['navy','amber']}
metadata['clips']={'run':{'frames':12,'cycleWorldDistance':56},'dribble-body':{'frames':12,'cycleWorldDistance':56},'defend':{'frames':8,'cycleWorldDistance':28},'brake':{'frames':4,'holdTicks':2},'dribble-arm':{'frames':18,'holdTicks':1,'clock':'owner.dribbleTick','overlayOffset':'body bob at current travel phase'}}
(OUT/'manifest.json').write_text(json.dumps(metadata,indent=2)+'\n',encoding='utf-8')
sheet=Image.new('RGB',(12*144,5*150),'#233147');d=ImageDraw.Draw(sheet)
for row,kind in enumerate(['run','dribble-body','defend','brake','dribble-arm']):
 count=metadata['clips'][kind]['frames']
 for col in range(min(12,count)):
  im=Image.open(OUT/f'navy-{kind}-{col:02}-source.png');sheet.paste(im,(col*144,row*150+18),im);d.text((col*144+3,row*150+2),f'{kind} {col}',fill='white')
sheet.save(REVIEW/'family-draft.png');print(json.dumps({'frames':len(metadata['frames']),'out':str(OUT)}))
