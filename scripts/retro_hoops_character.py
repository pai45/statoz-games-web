"""Original basketball-specific pixel construction, not traced reference sprites.
Canvas and authoritative contact origin remain compatible with the game.
"""
import math
from PIL import Image,ImageDraw

RIG={'nativeArtwork':[90,80],'exportScale':1.6,'canvas':[144,128],'feet':[72,116],'hipY':76,'shoulderY':51,
 'shoulderSpan':22,'waistSpan':18,'headHeight':13,'upperArmLength':21,'forearmLength':20,
 'thighLength':20,'shinLength':19,'armWidths':[9,7,4.5],'legWidths':[12,8,5],
 'construction':'V10 original tapered basketball anatomy, forward ready stance and connected action construction; observed reference direction, not traced or measured parity',
 'gait':{'classification':'Authored displacement-driven poses','footRollDegrees':[0,0,5,12,24,38,28,8,-15,-10,-4,0]}}
class PixelDraw:
 """Author on a coarse pixel grid. Export scaling is uniform, not anatomy repair."""
 def __init__(self,image):self.d=ImageDraw.Draw(image)
 def xy(self,points):return[(round(p[0]*.625),round(p[1]*.625))for p in points]
 def polygon(self,points,fill=None,outline=None):self.d.polygon(self.xy(points),fill=fill,outline=outline)
 def line(self,points,fill=None,width=1):self.d.line(self.xy(points),fill=fill,width=max(1,round(width*.625)))
 def point(self,point,fill=None):self.d.point(self.xy([point])[0],fill=fill)
def export(image):return image.resize((144,128),Image.Resampling.NEAREST)
def pt(p):return tuple(round(v)for v in p)
def mix(a,b,t):return(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t)
def clamp(v,a,b):return max(a,min(b,v))
def hinge(a,b,l1=21,l2=20,bend=1):
 dx,dy=b[0]-a[0],b[1]-a[1];distance=max(.01,math.hypot(dx,dy));r=clamp(distance,abs(l1-l2)+.1,l1+l2-.1)
 u=(l1*l1-l2*l2+r*r)/(2*r);h=math.sqrt(max(0,l1*l1-u*u))
 return(a[0]+dx/distance*u-dy/distance*h*bend,a[1]+dy/distance*u+dx/distance*h*bend)
def poly(d,points,fill,outline=None):d.polygon([pt(p)for p in points],fill=fill,outline=outline)
def segment(d,a,b,wa,wb,color,shadow,light,near=True):
 # Broad connected planes, with a quiet edge highlight instead of angular muscle plates.
 dx,dy=b[0]-a[0],b[1]-a[1];l=max(.01,math.hypot(dx,dy));nx,ny=-dy/l,dx/l
 def q(t,w):return(a[0]+dx*t+nx*w,a[1]+dy*t+ny*w)
 poly(d,[q(0,wa*.44),q(.28,wa*.5),q(.8,wb*.48),q(1,wb*.4),q(1,-wb*.4),q(.65,-wb*.46),q(.16,-wa*.46)],color,shadow)
 poly(d,[q(.08,wa*.22),q(.32,wa*.43),q(.82,wb*.4),q(.98,wb*.12),q(.68,wb*.07),q(.25,0)],shadow)
 if near:poly(d,[q(.16,-wa*.23),q(.32,-wa*.35),q(.66,-wb*.3),q(.78,-wb*.12),q(.35,-wa*.06)],light)

def hand(d,wrist,skin,towards=(1,0)):
 x,y=wrist;poly(d,[(x-3,y-2),(x,y-3),(x+3,y-1),(x+3,y+2),(x,y+4),(x-3,y+2)],skin[2],skin[0]);d.line([pt((x,y)),pt((x+2,y+1))],fill=skin[1]);d.point(pt((x,y-1)),fill=skin[3])
def arm(d,shoulder,wrist,skin,far=False,bend=-1,sleeve=False,elbow=None):
 elbow=elbow or hinge(shoulder,wrist,21,20,bend);shade=skin[1]if far else skin[2]
 segment(d,shoulder,elbow,9,7,shade,skin[0],skin[2 if far else 3],not far)
 x,y=elbow;poly(d,[(x-3,y-2),(x+1,y-3),(x+3,y),(x+1,y+3),(x-2,y+2)],shade)
 segment(d,elbow,wrist,7,4.5,shade,skin[0],skin[2 if far else 3],not far)
 if sleeve:
  cuff=mix(shoulder,elbow,.42);segment(d,shoulder,cuff,11,9,'#ede8d3','#899896','#fff6df',not far)
 hand(d,wrist,skin);return elbow
def shoe(d,ankle,far=False,view='side',roll=0):
 angle=math.radians(roll if view=='side'else 0);cs,sn=math.cos(angle),math.sin(angle)
 shape=[(-5,-6),(1,-6),(3,-2),(8,0),(10,2),(9,4),(-5,4),(-6,1)]if view=='side'else[(-5,-6),(4,-6),(5,0),(6,3),(3,5),(-4,5),(-6,2)]
 def rot(p):return(ankle[0]+p[0]*cs-p[1]*sn,ankle[1]+p[0]*sn+p[1]*cs)
 shift=min(0,116-max(rot(p)[1]for p in shape))
 def q(x,y):a,b=rot((x,y));return(a,b+shift)
 poly(d,[q(*p)for p in shape],'#111722','#090f16')
 if view=='side':
  poly(d,[q(-4,-4),q(0,-4),q(3,0),q(-2,1)],'#3d5062'if not far else'#283744')
  d.line([pt(q(-4,3)),pt(q(8,3))],fill='#d3d5c7',width=2)
  d.line([pt(q(-1,-3)),pt(q(2,-1))],fill='#b2bebd',width=2)
 else:
  poly(d,[q(-3,-4),q(3,-4),q(3,1),q(-3,1)],'#3d5062'if not far else'#283744')
  d.line([pt(q(-3,3)),pt(q(4,3))],fill='#d3d5c7',width=2)
  d.line([pt(q(-2,-2)),pt(q(2,-2))],fill='#b2bebd')
 return{'toe':q(9,2)if view=='side'else q(0,4),'heel':q(-5,2)if view=='side'else q(0,-3)}
def leg(d,hip,knee,ankle,skin,kit,far=False,view='side',roll=0):
 shade=skin[1]if far else skin[2]
 segment(d,hip,knee,12,8,shade,skin[0],skin[2 if far else 3],not far)
 segment(d,knee,ankle,8,5,shade,skin[0],skin[2 if far else 3],not far)
 x,y=knee;poly(d,[(x-3,y-2),(x+1,y-3),(x+4,y),(x+2,y+3),(x-2,y+2)],shade,skin[0]);d.line([pt((x-1,y-1)),pt((x+2,y))],fill=skin[2 if far else 3],width=1)
 hem=mix(hip,knee,.43);segment(d,hip,hem,14,13,kit[1],kit[0],kit[2],not far)
 # Loose shorts use one large lit panel and a dark inner-leg fold.
 v=mix(hip,hem,.7);d.line([pt((v[0]-2,v[1])),pt((hem[0]-1,hem[1]+1))],fill=kit[2],width=2)
 cuff=mix(knee,ankle,.8);segment(d,cuff,ankle,6,5,'#d5ddd2','#6d7f89','#f2f3dc',not far)
 return shoe(d,ankle,far,view,roll)
IDENTITIES={'navy':['dark-visor','close-crop','blond-flat-top'],'amber':['red-cap','dark-curls','blond-sweep']}
def head(d,center,skin,view,team,identity=0):
 x,y=center
 def q(u,v):return(x+u,y+v)
 shape=[(-5,-5),(3,-5),(5,-2),(6,0),(6,2),(4,2),(3,5),(-1,6),(-5,3),(-6,-1)]if view=='side'else[(-5,-5),(4,-5),(6,-1),(4,4),(1,6),(-3,5),(-5,2),(-6,-1)]
 poly(d,[q(*p)for p in shape],skin[2],skin[0]);poly(d,[q(-5,-2),q(-2,-1),q(-1,3),q(2,5),q(-1,6),q(-5,3)],skin[1])
 style=IDENTITIES[team][identity];hair='#1a2528'if style in ['dark-visor','close-crop','dark-curls']else'#a36d2a';shine='#52646a'if style in ['dark-visor','close-crop','dark-curls']else'#efd070'
 if style=='dark-curls':
  poly(d,[q(-6,-2),q(-7,-5),q(-5,-6),q(-6,-8),q(-3,-9),q(-1,-8),q(1,-10),q(3,-8),q(5,-8),q(6,-5),q(4,-3),q(0,-4),q(-2,-2)],hair)
  d.point(pt(q(-3,-7)),fill=shine);d.point(pt(q(2,-7)),fill=shine)
 elif style=='blond-flat-top':
  poly(d,[q(-5,-2),q(-6,-8),q(-3,-10),q(4,-10),q(5,-5),q(3,-3),q(0,-5)],hair)
  d.line([pt(q(-3,-9)),pt(q(3,-9))],fill=shine,width=2);d.line([pt(q(-4,-6)),pt(q(-3,-3))],fill='#d9aa48')
 elif style=='blond-sweep':
  poly(d,[q(-5,0),q(-7,-4),q(-5,-8),q(-1,-9),q(5,-7),q(6,-4),q(1,-3),q(-1,-5),q(-3,-2)],hair)
  d.line([pt(q(-3,-7)),pt(q(3,-6))],fill=shine,width=2)
 else:
  poly(d,[q(-5,-2),q(-6,-5),q(-3,-7),q(3,-7),q(5,-4),q(2,-3),q(-1,-4)],hair)
  d.line([pt(q(-2,-6)),pt(q(2,-6))],fill=shine,width=2)
 if view=='back':poly(d,[q(-5,-3),q(4,-4),q(5,0),q(2,3),q(-3,3)],hair)
 if style in ['dark-visor','red-cap']:
  cap='#972b28'if style=='red-cap'else'#1b343b';light='#e45739'if style=='red-cap'else'#507780'
  poly(d,[q(-6,-4),q(-5,-8),q(-1,-9),q(4,-7),q(5,-4)],cap)
  d.line([pt(q(-3,-7)),pt(q(1,-7))],fill=light,width=2)
  if view=='side':poly(d,[q(1,-5),q(7,-5),q(9,-3),q(3,-2)],cap,'#17252b')
  elif view=='front':d.line([pt(q(-5,-3)),pt(q(6,-3))],fill=cap,width=3)
  else:d.line([pt(q(-2,-3)),pt(q(2,-3))],fill=light)
 if view=='back':return
 if view=='side':
  d.line([pt(q(1,-1)),pt(q(4,-1))],fill=skin[0]);d.point(pt(q(5,0)),fill=skin[3]);d.line([pt(q(1,4)),pt(q(3,4))],fill=skin[0]);d.point(pt(q(-3,0)),fill=skin[3])
 else:
  d.point(pt(q(-3,0)),fill=skin[0]);d.point(pt(q(3,0)),fill=skin[0]);d.line([pt(q(0,0)),pt(q(1,2))],fill=skin[3]);d.line([pt(q(-1,4)),pt(q(2,4))],fill=skin[0])
def torso(d,center,hip,palette,view,roll):
 x,y=center;hx,hy=hip;kit=palette['shirt'];width=11 if view=='side'else 13
 def q(u,v):t=clamp(v/max(1,hy-y),0,1);return(x+(hx-x)*t+u,y+v+roll*u/width*(1-t))
 h=hy-y;waist=9 if view=='side'else 10
 poly(d,[q(-width+2,-3),q(-5,-5),q(4,-5),q(width-2,-3),q(width,2),q(width-2,10),q(waist,h+2),q(0,h+4),q(-waist,h+2),q(-width+2,10),q(-width,2)],kit[2],kit[0])
 # One shadowed cloth side and a vertical light plane; no chest-emblem highlight.
 poly(d,[q(-width+1,1),q(-width+4,3),q(-width+4,12),q(-waist+3,h),q(-waist,h+1),q(-width+2,10)],kit[1])
 poly(d,[q(width-3,0),q(width-1,3),q(waist,h+1),q(waist-3,h-1),q(width-5,10)],kit[1])
 poly(d,[q(-4,0),q(-1,1),q(-1,10),q(-3,h-5),q(-5,h-3),q(-5,10)],kit[3])
 d.line([pt(q(-5,h-1)),pt(q(2,h))],fill=kit[0],width=1)
 if view=='back':
  d.line([pt(q(-4,-3)),pt(q(3,-3))],fill=kit[3],width=1)
  d.line([pt(q(-1,6)),pt(q(-1,12))],fill='#d3e4d4',width=2);d.line([pt(q(3,6)),pt(q(3,12))],fill='#d3e4d4',width=2)
 else:d.line([pt(q(-5,-4)),pt(q(-3,-1)),pt(q(2,-1)),pt(q(4,-4))],fill=kit[3],width=1)

def render_character(team,kind,index,count,view,palettes,identity=0,includeHead=True):
 palette=palettes[team];skin=palette['skin'];short=palette['short'];phase=index/max(1,count);stride=math.sin(phase*math.tau);im=Image.new('RGBA',(90,80));d=PixelDraw(im)
 bob=0;hips=[(66,76),(77,76)];chest=(79,55);roll=1;headOffset=0;ankles=[(56,112),(86,112)];knees=[(60,95),(90,94)];hands=[(91,78),(97,73)];elbows=[(72,73),(95,62)];footRoll=[0,0]
 overlay=kind in ['dribble-arm','dribble-switch'];dynamic=kind in ['dribble-body','shot','throw','finish','fake','catch']
 if kind in ['run','dribble-body'] or overlay:
  bob=round(-2*math.sin(phase*math.tau*2))if not overlay else 0;chest=(85,52+bob);hips=[(67,75+bob),(76,75+bob)];roll=0 if kind!='run'else 2*stride;headOffset=2
  feet=[(93,112),(86,112),(76,112),(66,112),(54,110),(48,103),(52,92),(61,89),(76,92),(88,99),(94,107),(96,112)]
  kneesPath=[(88,94),(84,94),(79,93),(75,91),(69,86),(67,82),(73,80),(82,82),(90,85),(94,89),(95,93),(93,95)]
  step=index%12;ankles=[feet[(step+6)%12],feet[step]];knees=[(kneesPath[(step+6)%12][0]-9,kneesPath[(step+6)%12][1]+bob),(kneesPath[step][0],kneesPath[step][1]+bob)]
  footRoll=[RIG['gait']['footRollDegrees'][(step+6)%12],RIG['gait']['footRollDegrees'][step]]
  hands=[(81-15*stride,72-8*max(0,stride)),(96+11*stride,69+6*max(0,-stride))];elbows=[(66-5*stride,72-2*stride),(99+4*stride,65+4*stride)]
 elif kind in ['defend','backpedal','neutral-a','neutral-b']:
  t=1-phase if kind=='backpedal'else phase;shuffle=math.sin(t*math.tau)*4 if kind in ['defend','backpedal']else 0
  hips=[(65,81),(76,81)];chest=(85,59);headOffset=2;ankles=[(53+shuffle,112),(88+shuffle,112)];knees=[(59+shuffle*.5,96),(93+shuffle*.5,94)];hands=[(96,79),(103,72)];elbows=[(76,76),(99,63)]
  if kind=='neutral-b':chest=(85,60);hips=[(65,82),(76,82)]
 elif kind in ['brake','pivot']:
  t=index/max(1,count-1);chest=(83-7*t,56+3*t);hips=[(65,78),(77,78)];ankles=[(52+4*t,112),(91-4*t,112)];knees=[(57+5*t,97),(94-4*t,94)];hands=[(91,82),(100,74)];elbows=[(73,77),(99,65)]
 elif kind in ['shot','s-ready','s-rise','s-release','s-follow']:
  # Held wrists follow the authoritative low/high phases; only torso anticipation is smoothed.
  age=index*2 if kind=='shot'else{'s-ready':4,'s-rise':16,'s-release':24,'s-follow':34}[kind];lift=clamp((age-8)/10,0,1);hips=[(65,78-5*lift),(77,78-5*lift)];chest=(78,55-7*lift);roll=-1
  extendT=clamp((age-18)/4,0,1);hands=[(90,54)if age<10 else(82+17*extendT,21-9*extendT),(85,56)if age<10 else(80+17*extendT,24-9*extendT)]
  if age>26:hands=[mix((99,12),(86,65),clamp((age-26)/24,0,1)),mix((93,15),(92,70),clamp((age-26)/24,0,1))]
  ankles=[(60,112 if age<10 or age>48 else 103),(85,112 if age<10 or age>48 else 107)];knees=[(66,95-8*lift),(87,93-5*lift)];elbows=[None,None]
 elif kind in ['throw','p-pass-gather-left','p-pass-extend-left']:
  age=index*2 if kind=='throw'else 4 if kind=='p-pass-gather-left'else 12;t=clamp((age-8)/6,0,1);chest=(69+4*t,55);roll=-3+4*t;hands=[mix((46,55),(40,44),t),mix((51,58),(45,47),t)];ankles=[(52,112),(92,112)];knees=[(55,96),(88,96)];elbows=[None,None]
 elif kind in ['finish','dunk-gather','dunk-contact']:
  # V11 bounded correction: keep shoulder over the low held ball until its existing age15 lift.
  age=index*3 if kind=='finish'else 9 if kind=='dunk-gather'else 21;t=0 if age<15 else 1;chest=mix((92,62),(85,51),t);hips=[mix((68,78),(65,74),t),mix((79,78),(76,74),t)];roll=-3;headOffset=1;hands=[(117,89)if age<15 else(100,47),(109,92)if age<15 else(92,51)];ankles=[(52,99),(91,106)]if age<40 else[(60,112),(85,112)];knees=[(64,85),(89,89)];elbows=[None,None]
 elif kind in ['jump-block','a-overhead','a-reach']:
  age=index*2 if kind=='jump-block'else 14 if kind=='a-overhead'else 4;t=clamp((age-28)/16,0,1);chest=(73,48);hips=[(65,73),(77,73)];hands=[mix((77,12),(90,53),t),mix((62,17),(55,62),t)];ankles=[(57,109),(87,108)];knees=[(60,91),(88,90)];elbows=[None,None]
 elif kind in ['reach','collect','d-low','d-down']:
  chest=(87,67);hips=[(65,86),(77,86)];hands=[(104,88)if kind=='reach'else(59,103),(93,85)];ankles=[(46,112),(98,112)];knees=[(51,99),(98,97)];elbows=[None,(98,76)];roll=4;headOffset=2
 elif kind in ['recover','land-recover']:
  t=1-index/max(1,count-1);chest=(78,54+9*t);hips=[(65,76+6*t),(77,76+6*t)];hands=[(87,85),(98,80)];elbows=[(69,77),(99,68)];knees=[(58,97),(92,95)]
 elif kind=='fake':
  t=math.sin(phase*math.pi);chest=(79,55-3*t);hands=[(83+12*t,77-45*t),(76+12*t,80-45*t)];elbows=[None,None]
 elif kind=='catch':
  chest=(79,55);hands=[mix((96,61),(72,77),min(1,index/5)),mix((89,63),(80,77),min(1,index/5))];elbows=[None,None]
 elif kind in ['carry-front','carry-low','d-push']:
  chest=(79,56);hands=[(72,77),(80,77)];elbows=[(63,73),(96,73)]
 if view in ['front','back']:
  chest=(72,chest[1]);headOffset=0;roll=0
  if kind in ['run','dribble-body']or overlay:
   ankles=[(60+5*stride,112-max(0,stride)*14),(83-5*stride,112-max(0,-stride)*14)];knees=[(60+4*stride,94-8*max(0,stride)),(85-4*stride,94-8*max(0,-stride))];hands=[(52,76+8*stride),(94,76-8*stride)];elbows=[(52,67+4*stride),(93,67-4*stride)]
  elif kind in ['neutral-a','neutral-b','defend','backpedal']:
   hands=[(49,81),(97,80)];elbows=[(49,70),(96,69)];knees=[(57,97),(88,95)]
 nearShoulder=(chest[0]-8,chest[1]-roll);farShoulder=(chest[0]+9,chest[1]+roll)
 if view in ['front','back']:nearShoulder=(chest[0]-11,chest[1]);farShoulder=(chest[0]+11,chest[1])
 if overlay:
  tick=index//4 if kind=='dribble-switch'else index;blend=[-1,-.5,0,.5][index%4]if kind=='dribble-switch'else 1;j=tick//6;t=(tick%6)/6;e=t*t*(3-2*t);offsets=[-12,8,-20,-12];bx=(offsets[j]+(offsets[j+1]-offsets[j])*e)*blend;bz=6+30*abs(1-tick/9);wrist=(72+bx,116-max(29,bz+4));elbow=arm(d,nearShoulder,wrist,skin,sleeve=team=='amber')
  return export(im),{'feet':[72,116],'hands':[list(wrist)],'ball':[72+bx,116-bz],'shoulder':list(nearShoulder),'elbows':[list(elbow)]}
 farFoot=leg(d,hips[0],knees[0],ankles[0],skin,short,True,view,footRoll[0]);farElbow=arm(d,farShoulder,hands[1],skin,True,-1 if hands[1][1]<farShoulder[1]else 1,team=='amber',elbows[1])
 hx,hy=mix(hips[0],hips[1],.5);poly(d,[(hx-10,hy-2),(hx+10,hy-2),(hx+12,hy+7),(hx+3,hy+10),(hx-1,hy+7),(hx-10,hy+9)],short[1],short[0])
 nearFoot=leg(d,hips[1],knees[1],ankles[1],skin,short,False,view,footRoll[1]);torso(d,chest,(hx,hy),palette,view,roll)
 neck=(chest[0]+headOffset,chest[1]-8);poly(d,[(neck[0]-4,neck[1]-3),(neck[0]+3,neck[1]-3),(neck[0]+4,neck[1]+3),(neck[0]-3,neck[1]+3)],skin[2],skin[0]);headCenter=(neck[0]+1,chest[1]-14);
 if includeHead:head(d,headCenter,skin,view,team,identity)
 nearElbow=elbows[0]or hinge(nearShoulder,hands[0],21,20,1 if hands[0][1]<nearShoulder[1]else-1)
 if not dynamic:nearElbow=arm(d,nearShoulder,hands[0],skin,False,1 if hands[0][1]<nearShoulder[1]else-1,team=='amber',nearElbow)
 return export(im),{'feet':[72,116],'hips':[hx,hy],'shoulders':[list(nearShoulder),list(farShoulder)],'hands':[list(p)for p in hands],'ankles':[list(p)for p in ankles],'knees':[list(p)for p in knees],'toes':[list(farFoot['toe']),list(nearFoot['toe'])],'heels':[list(farFoot['heel']),list(nearFoot['heel'])],'elbows':[list(nearElbow),list(farElbow)],'neck':list(neck),'head':list(headCenter)}
