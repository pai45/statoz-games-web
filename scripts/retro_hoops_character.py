"""Editable original athlete construction; no input bitmap or traced coordinates.
144x128 canvas, feet (72,116). Anatomy uses posed segments, never sprite scaling.
"""
import math
from PIL import Image, ImageDraw

RIG={"canvas":[144,128],"feet":[72,116],"hipY":69,"shoulderY":48,
     "shoulderSpan":27,"waistSpan":23,"headHeight":16,
     "upperArmLength":22,"forearmLength":22,"thighLength":21,"shinLength":20,
     "armWidths":[12,9,5],"legWidths":[16,11,5],
     "gait":{"classification":"authored projected poses, not recovered source frames",
             "footRollDegrees":[0,0,4,12,28,42,30,10,-18,-12,-5,0]}}

def pt(p):return tuple(round(n)for n in p)
def mix(a,b,t):return(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t)
def clamp(x,a,b):return max(a,min(b,x))
def hinge(a,b,l1=20,l2=20,bend=1):
 dx,dy=b[0]-a[0],b[1]-a[1];distance=max(.001,math.hypot(dx,dy));r=min(distance,l1+l2-.1)
 u=(l1*l1-l2*l2+r*r)/(2*r);h=math.sqrt(max(0,l1*l1-u*u));return(a[0]+dx/distance*u-dy/distance*h*bend,a[1]+dy/distance*u+dx/distance*h*bend)
def segment(d,a,b,widthA,widthB,color,shadow,light,near=True):
 """Tapered muscle belly with clustered highlights; no uniform stick stroke."""
 dx,dy=b[0]-a[0],b[1]-a[1];length=max(.01,math.hypot(dx,dy));nx,ny=-dy/length,dx/length
 def side(p,w,s=1):return(p[0]+nx*w*s,p[1]+ny*w*s)
 mid=mix(a,b,.4);outline=[side(a,widthA/2),side(mid,max(widthA,widthB)*.56),side(b,widthB/2),side(b,widthB/2,-1),side(mid,max(widthA,widthB)*.5,-1),side(a,widthA/2,-1)]
 d.polygon([pt(p)for p in outline],fill=color,outline=shadow)
 d.polygon([pt(side(a,widthA*.3)),pt(side(mid,max(widthA,widthB)*.4)),pt(side(b,widthB*.24)),pt(mix(a,b,.8)),pt(mix(a,b,.18))],fill=shadow)
 if near:d.line([pt(side(mix(a,b,.17),widthA*.19,-1)),pt(side(mix(a,b,.65),widthB*.2,-1))],fill=light,width=2)
def hand(d,wrist,skin,towards=(1,0)):
 x,y=pt(wrist);d.polygon([(x-3,y-2),(x,y-3),(x+3,y-1),(x+3,y+2),(x+1,y+4),(x-2,y+3)],fill=skin[2],outline=skin[0]);d.line([(x,y-1),(x+2,y)],fill=skin[3]);d.point((x+1,y+2),fill=skin[1])
def arm(d,shoulder,wrist,skin,far=False,bend=-1,sleeve=False,elbow=None):
 elbow=elbow or hinge(shoulder,wrist,22,22,bend)
 shade=skin[1]if far else skin[2]
 segment(d,shoulder,elbow,12,9,shade,skin[0 if far else 1],skin[2 if far else 3],not far)
 x,y=pt(elbow);d.ellipse((x-4,y-3,x+4,y+3),fill=shade)
 segment(d,elbow,wrist,9,5,shade,skin[0 if far else 1],skin[2 if far else 3],not far)
 if sleeve:
  hem=mix(shoulder,elbow,.4);segment(d,shoulder,hem,13,11,'#e9e3ce','#879da6','#fff4d5',not far)
 hand(d,wrist,skin)
 return elbow
def shoe(d,ankle,tilt=0,far=False,view='side',roll=0):
 """Author high-top geometry in each view; rotate points, never sprite rasters.
 The sole is clamped to the ground plane through planted contact frames.
 """
 angle=math.radians(roll if view=='side'else 0);cs,sn=math.cos(angle),math.sin(angle)
 if view=='side':shape=[(-5,-7),(1,-7),(3,-3),(7,-1),(11,1),(10,4),(-5,4),(-6,1)]
 else:shape=[(-5,-7),(4,-7),(5,-2),(6,2),(4,5),(-4,5),(-6,2)]
 def rotate(p):return(ankle[0]+p[0]*cs-p[1]*sn,ankle[1]+p[0]*sn+p[1]*cs)
 floorShift=min(0,116-max(rotate(p)[1]for p in shape))
 def q(x,y):
  a,b=rotate((x,y));return pt((a,b+floorShift))
 d.polygon([q(*p)for p in shape],fill='#1b2027',outline='#10151b')
 side='#52616a'if not far else'#34434d'
 if view=='side':
  d.polygon([q(*p)for p in [(-4,-5),(0,-5),(2,-2),(6,0),(-2,1)]],fill=side)
  d.line([q(-4,3),q(9,3)],fill='#f1ead4',width=2)
  d.line([q(0,-4),q(3,-2)],fill='#c4cac0',width=2)
  d.line([q(-4,-5),q(-3,-1)],fill='#a6b2ac')
 elif view=='front':
  d.polygon([q(-3,-4),q(3,-4),q(4,1),q(-4,1)],fill=side)
  d.line([q(-3,-3),q(2,-3)],fill='#c4cac0');d.line([q(-2,-1),q(3,-1)],fill='#c4cac0')
  d.line([q(-4,3),q(4,3)],fill='#f1ead4',width=2)
 else:
  d.polygon([q(-3,-5),q(3,-5),q(4,1),q(-4,1)],fill=side)
  d.line([q(-2,-4),q(2,-4)],fill='#c4cac0',width=2)
  d.line([q(-4,3),q(4,3)],fill='#f1ead4',width=2)
 return {'toe':q(10,2)if view=='side'else q(0,4),'heel':q(-5,2)if view=='side'else q(0,-3)}


def leg(d,hip,ankle,knee,skin,short,far=False,view='side',roll=0):
 shade=skin[1]if far else skin[2]
 segment(d,hip,knee,16,11,shade,skin[0 if far else 1],skin[2 if far else 3],not far)
 x,y=pt(knee);d.ellipse((x-4,y-3,x+4,y+4),fill=shade);d.line([(x-2,y-2),(x+1,y-2)],fill=skin[2 if far else 3])
 segment(d,knee,ankle,11,5,shade,skin[0 if far else 1],skin[2 if far else 3],not far)
 hem=mix(hip,knee,.52);segment(d,hip,hem,15,14,short[1],short[0],short[2],not far)
 # Hem stripe, sock cuff and separated shoe sole remain stable across poses.
 dx,dy=hem[0]-hip[0],hem[1]-hip[1];length=max(1,math.hypot(dx,dy));nx,ny=-dy/length,dx/length
 d.line([pt((hem[0]-nx*6,hem[1]-ny*6)),pt((hem[0]+nx*6,hem[1]+ny*6))],fill=short[2],width=2)
 cuff=mix(knee,ankle,.72);segment(d,cuff,ankle,7,6,'#f0f0dc','#8d9ca9','#fff9df',not far);return shoe(d,ankle,ankle[0]-hip[0],far,view,roll)
def head(d,center,skin,view,team):
 """Compact adult brow, cheek and jaw clusters; original fictional faces."""
 x,y=pt(center)
 if view=='front':face=[(-5,-6),(4,-6),(6,-2),(5,3),(2,6),(-2,6),(-5,3),(-6,-1)]
 elif view=='back':face=[(-5,-6),(4,-6),(6,-2),(5,3),(2,6),(-3,5),(-6,1)]
 else:face=[(-5,-6),(3,-6),(5,-3),(5,-1),(7,0),(7,2),(5,2),(4,5),(0,6),(-4,4),(-6,0)]
 def q(p):return(x+p[0],y+p[1])
 d.polygon([q(p)for p in face],fill=skin[2],outline=skin[0])
 if view!='back':
  d.polygon([q(p)for p in [(-5,-2),(-2,-1),(-2,2),(1,5),(-1,6),(-4,4),(-6,0)]],fill=skin[1])
 hair='#20252a'if team=='navy'else'#91682e';light='#566267'if team=='navy'else'#e1bc5b'
 d.polygon([q(p)for p in [(-5,-2),(-6,-5),(-4,-8),(2,-8),(5,-6),(5,-4),(1,-5),(-2,-3)]],fill=hair)
 d.line([q((-3,-7)),q((2,-7))],fill=light,width=2)
 if view=='back':
  d.polygon([q(p)for p in [(-5,-3),(4,-4),(5,0),(3,3),(-2,4),(-5,1)]],fill=hair)
  d.line([q((-3,-1)),q((2,-2))],fill=light)
 elif view=='front':
  d.line([q((-4,-1)),q((-2,-1))],fill=skin[0]);d.line([q((2,-1)),q((4,-1))],fill=skin[0])
  d.line([q((0,0)),q((1,2))],fill=skin[3]);d.line([q((-1,4)),q((2,4))],fill=skin[0])
  d.point(q((4,2)),fill=skin[3])
 else:
  d.line([q((1,-2)),q((4,-2))],fill=skin[0]);d.point(q((4,-1)),fill=skin[0])
  d.line([q((5,0)),q((6,0))],fill=skin[3]);d.line([q((2,4)),q((4,4))],fill=skin[0])
  d.rectangle((x-4,y-1,x-2,y+2),fill=skin[2]);d.point((x-3,y),fill=skin[1])


def torso(d,center,hipY,palette,view,team,bob=0,twist=0):
 """Pose the chest over the pelvis; clothing follows the body axis, not a box.
 All points below are original construction. The reference informs weight and
 action language, not copied contours or native timing.
 """
 x,y=center;kit=palette['shirt'];wide=16 if view in ['front','back']else 14
 def q(u,v):
  t=clamp(v/max(1,hipY-y),0,1)
  return pt((x+(72-x)*t+u,y+v+twist*u/wide*(1-t)))
 hem=hipY-y
 # Broad shoulder yoke, cut-in armholes, ribcage, narrower waist, loose hem.
 outline=[(-wide+3,-5),(-6,-9),(5,-9),(wide-2,-5),(wide,2),
          (10,11),(11,hem+2),(3,hem+4),(-11,hem+2),(-10,12),(-wide,2)]
 d.polygon([q(*p)for p in outline],fill=kit[2],outline=kit[0])
 d.polygon([q(*p)for p in [(-wide+1,1),(-8,0),(-6,10),(-8,hem-2),(-10,hem+1),(-11,12)]],fill=kit[1])
 d.polygon([q(*p)for p in [(7,-4),(wide-1,2),(9,12),(10,hem),(5,hem-2),(6,9)]],fill=kit[1])
 # Small stable light clusters rather than a white column down the whole vest.
 d.polygon([q(*p)for p in [(-4,-1),(2,-2),(5,4),(3,8),(-2,6)]],fill=kit[3])
 d.line([q(-4,12),q(-2,16)],fill=kit[3],width=2)
 d.line([q(-8,hem),q(8,hem)],fill=kit[3],width=2)
 d.line([q(-7,hem-4),q(-4,hem-7)],fill=kit[0])
 d.line([q(4,hem-5),q(8,hem-7)],fill=kit[0])
 if view=='back':d.line([q(-6,-6),q(4,-6)],fill='#d7e0c6',width=2)
 else:d.line([q(-6,-7),q(-4,-3),q(0,-2),q(5,-6)],fill='#f1e6cf',width=2)
 # Original kit number, held below the chest light so it reads separately.
 nx=-2 if view=='back'else 1
 d.line([q(nx,7),q(nx,12)],fill='#e2e5c6',width=2)
 d.line([q(nx-2,8),q(nx,7)],fill='#e2e5c6')
 if view=='back':
  d.line([q(nx+5,7),q(nx+5,12)],fill='#e2e5c6',width=2)
  d.line([q(-6,3),q(7,3)],fill=kit[3])


def render_character(team,kind,index,count,view,palettes):
 palette=palettes[team];skin=palette['skin'];short=palette['short'];phase=index/max(1,count);im=Image.new('RGBA',(144,128));d=ImageDraw.Draw(im)
 overlay=kind in ['dribble-arm','dribble-switch'];bob=0;lean=0;crouch=0;roll=0;chestDrop=0;headLead=0;nearElbow=None;farElbow=None;hipX=72;hipY=RIG["hipY"];nearWrist=(81,73);farWrist=(92,74);ankles=[(59,112),(84,112)];knees=None;stride=math.sin(phase*math.tau)
 if kind in ['run','dribble-body']:
  bob=round(-2*math.sin(phase*math.tau*2));lean=9;headLead=3
  if kind=='run':roll=1.5*stride;lean+=round(stride);chestDrop=1
  # Grounded support through 58% of a cycle; swing foot clears in a folded recovery.
  def foot(t):
   t%=1
   if t<.58:return(88-34*t/.58,112)
   q=(t-.58)/.42;return(54+34*q,112-17*math.sin(q*math.pi))
  steps=[(90,112),(83,112),(75,112),(67,112),(57,110),(52,103),(55,95),(63,91),(74,94),(83,101),(89,109),(92,112)]
  step=index%12;ankles=[steps[(step+6)%12],steps[step]];nearWrist=(74-15*stride,68-7*max(0,stride));farWrist=(89+14*stride,65+5*max(0,-stride))
 elif kind in ['defend','backpedal']:
  if kind=='backpedal':phase=1-phase
  crouch=8;lean=4;headLead=2;ankles=[(52+5*math.sin(phase*math.tau),112-max(0,math.cos(phase*math.tau))*2),(91+5*math.sin(phase*math.tau),112-max(0,-math.cos(phase*math.tau))*2)];nearWrist=(47,70);farWrist=(100,66)
 elif kind in ['brake','pivot']:
  t=index/max(1,count-1);crouch=round(5*math.sin(t*math.pi));lean=round(5-8*t);ankles=[(54+9*t,112),(92-6*t,112)];nearWrist=(53+9*t,76);farWrist=(92-5*t,69)
 elif overlay:
  tick=index//4 if kind=='dribble-switch'else index;blend=[-1,-.5,0,.5][index%4]if kind=='dribble-switch'else 1;segmentIndex=tick//6;t=(tick%6)/6;e=t*t*(3-2*t);offsets=[-12,8,-20,-12];bx=(offsets[segmentIndex]+(offsets[segmentIndex+1]-offsets[segmentIndex])*e)*blend;bz=6+30*abs(1-tick/9);nearWrist=(72+bx,116-max(29,bz+4));farWrist=(88,68);lean=9;headLead=3
 elif kind in ['shot','s-ready','s-rise','s-release','s-follow']:
  age=index*2 if kind=='shot'else{'s-ready':4,'s-rise':16,'s-release':24,'s-follow':34}[kind]
  if age<10:crouch=6*(1-age/10);nearWrist=(90,54);farWrist=(86,56)
  else:
   release=clamp((age-18)/4,0,1);nearWrist=(82+17*release,21-9*release);farWrist=(nearWrist[0]-6,nearWrist[1]+3)
  if age>26:nearWrist=mix((99,12),(84,60),min(1,(age-26)/24));farWrist=(nearWrist[0]-7,nearWrist[1]+5)
  lean=-2 if age<10 else 3 if age<28 else 1;roll=-2 if age<10 else 1;headLead=1
  ankles=[(61,112 if age<10 or age>48 else 103),(85,112 if age<10 or age>48 else 107)]
 elif kind in ['throw','p-pass-gather-left','p-pass-extend-left']:
  age=index*2 if kind=='throw'else 4 if kind=='p-pass-gather-left'else 12;t=clamp((age-8)/6,0,1);nearWrist=mix((46,55),(40,44),t);farWrist=(nearWrist[0]+5,nearWrist[1]+3);lean=-6+3*t;roll=-3+5*t;headLead=-2;crouch=3;ankles=[(56,112),(88,112)]
 elif kind in ['finish','dunk-gather','dunk-contact']:
  age=index*3 if kind=='finish'else 9 if kind=='dunk-gather'else 21;t=clamp((age-6)/9,0,1);nearWrist=mix((117,89),(100,47),t);farWrist=(nearWrist[0]-8,nearWrist[1]+4);lean=7+3*t if age<40 else 1;roll=-2 if age<40 else 0;headLead=2;ankles=[(56,100),(91,106)]if age<40 else[(62,112),(84,112)]
 elif kind in ['jump-block','a-overhead','a-reach']:
  age=index*2 if kind=='jump-block'else 14 if kind=='a-overhead'else 4;t=clamp((age-28)/16,0,1);nearWrist=mix((77,12),(90,53),t);farWrist=mix((62,17),(55,62),t);ankles=[(59,109),(88,108)]
 elif kind in ['reach','collect','d-low','d-down']:
  crouch=12;lean=10;roll=3;headLead=3;nearWrist=(102,87)if kind=='reach'else(59,103);farWrist=(88,81);ankles=[(50,112),(94,112)]
 elif kind in ['recover','land-recover']:
  crouch=round(8*(1-index/max(1,count-1)));nearWrist=(58,81);farWrist=(91,74);ankles=[(55,112),(89,112)]
 elif kind=='fake':
  t=math.sin(phase*math.pi);nearWrist=(83+12*t,77-45*t);farWrist=(nearWrist[0]-7,nearWrist[1]+3);crouch=3
 elif kind=='catch':nearWrist=mix((96,61),(72,77),min(1,index/5));farWrist=(nearWrist[0]-7,nearWrist[1]+2)
 elif kind in ['carry-front','carry-low','d-push']:nearWrist=(72,77);farWrist=(80,77)
 elif kind=='neutral-b':bob=1
 if kind in ['neutral-a','neutral-b']:nearWrist=(60,82);farWrist=(90,79);crouch=2;lean=2;chestDrop=1
 if view in ['front','back'] and (kind in ['run','dribble-body'] or overlay):lean=0;headLead=0;roll=0;chestDrop=0
 hipY+=bob+crouch;torsoCenter=(72+lean,RIG["shoulderY"]+bob+crouch+chestDrop);nearShoulder=(torsoCenter[0]-10,torsoCenter[1]-1-roll);farShoulder=(torsoCenter[0]+11,torsoCenter[1]+roll);hips=[(67,hipY),(78,hipY)]
 if view in ['front','back']:
  # Directional figures use distinct shoulders, chest/back and anatomical overlap.
  nearShoulder=(torsoCenter[0]-12,torsoCenter[1]);farShoulder=(torsoCenter[0]+12,torsoCenter[1]);
  if kind in ['run','dribble-body']:ankles=[(62+6*stride,112-max(0,stride)*12),(82-6*stride,112-max(0,-stride)*12)];nearWrist=(53,72+8*stride);farWrist=(95,72-8*stride)
 # Carry the shoulder, elbow and wrist together. Running has a tucked bent
 # elbow instead of solving a near-closed hand target into a wide windmill.
 if kind in ['run','dribble-body']:
  if view=='side':
   nearElbow=(torsoCenter[0]-16-6*stride,torsoCenter[1]+17-2*stride)
   farElbow=(torsoCenter[0]+15+5*stride,torsoCenter[1]+14+3*stride)
  else:
   nearElbow=(torsoCenter[0]-17,torsoCenter[1]+15+4*stride)
   farElbow=(torsoCenter[0]+17,torsoCenter[1]+15-4*stride)
 if kind in ['neutral-a','neutral-b','carry-front','carry-low','d-push']:
  nearElbow=(nearShoulder[0]-5,nearShoulder[1]+18)
  farElbow=(farShoulder[0]+5,farShoulder[1]+17)
 if kind in ['defend','backpedal']:
  nearElbow=(nearShoulder[0]-15,nearShoulder[1]+12)
  farElbow=(farShoulder[0]+13,farShoulder[1]+10)
 if overlay:
  elbow=arm(d,nearShoulder,nearWrist,skin,False,-1,sleeve=team=='amber');return im,{'feet':[72,116],'hands':[list(nearWrist)],'ball':[72+bx,116-bz],'shoulder':list(nearShoulder),'elbows':[list(elbow)]}
 # Projected knee paths: the stance keeps kneecaps over toes, while the swing
 # leg folds. Solving both knees as maximal 2D hinges caused a bow-legged idle.
 knees=[]
 for i in range(2):
  knee=mix(hips[i],ankles[i],.53);lift=max(0,112-ankles[i][1]);flex=3+clamp(crouch*.3+lift*.18,0,5)
  knees.append((knee[0]+(-flex if i==0 else flex),knee[1]-lift*.1))
 # The swing knee drives forward while the rear ankle folds toward it.
 # Projection is authored from observed movement language, not frame tracing.
 footRoll=[0,0]
 if kind in ['run','dribble-body'] and view=='side':
  path=[(88,90),(87,91),(83,92),(78,91),(69,88),(66,84),(70,82),(77,82),(85,85),(90,88),(91,91),(91,91)]
  step=index%12
  knees=[(path[(step+6)%12][0]-8,path[(step+6)%12][1]+bob),(path[step][0],path[step][1]+bob)]
  footRoll=[RIG['gait']['footRollDegrees'][(step+6)%12],RIG['gait']['footRollDegrees'][step]]
 farFoot=leg(d,hips[0],ankles[0],knees[0],skin,short,True,view,footRoll[0])
 elbowFar=arm(d,farShoulder,farWrist,skin,True,-1 if farWrist[1]<farShoulder[1]-8 or kind in ['neutral-a','neutral-b','carry-front','carry-low','d-push']else 1,team=='amber',elbow=farElbow)
 # Loose shorts connect the hips before the jersey is laid over the waist.
 d.polygon([pt((62,hipY-2)),pt((82,hipY-2)),pt((85,hipY+8)),pt((75,hipY+11)),pt((71,hipY+7)),pt((63,hipY+10))],fill=short[1],outline=short[0]);d.line([pt((64,hipY)),pt((81,hipY))],fill=short[2],width=2)
 nearFoot=leg(d,hips[1],ankles[1],knees[1],skin,short,False,view,footRoll[1])
 torso(d,torsoCenter,hipY,palette,view,team,twist=roll)
 neckX=torsoCenter[0]-1+headLead;ny=torsoCenter[1]-10;d.polygon([pt((neckX-4,ny-4)),pt((neckX+3,ny-4)),pt((neckX+4,ny+3)),pt((neckX,ny+6)),pt((neckX-4,ny+2))],fill=skin[2],outline=skin[1]);head(d,(neckX,torsoCenter[1]-19),skin,view,team)
 # Body action layers intentionally leave the near arm to the runtime grip overlay.
 dynamic=kind in ['dribble-body','shot','throw','finish','fake','catch']
 nearBend=1 if kind in ['neutral-a','neutral-b','jump-block','a-overhead','a-reach']else -1
 elbowNear=nearElbow or hinge(nearShoulder,nearWrist,22,22,nearBend)
 if not dynamic:elbowNear=arm(d,nearShoulder,nearWrist,skin,False,nearBend,team=='amber',elbow=nearElbow)
 return im,{'feet':[72,116],'hips':list((72,hipY)),'shoulders':[list(nearShoulder),list(farShoulder)],'hands':[list(nearWrist),list(farWrist)],'ankles':[list(p)for p in ankles],'knees':[list(p)for p in knees],'toes':[list(farFoot['toe']),list(nearFoot['toe'])],'heels':[list(farFoot['heel']),list(nearFoot['heel'])],'elbows':[list(elbowNear),list(elbowFar)],'neck':[neckX,ny],'head':[neckX,torsoCenter[1]-19]}
