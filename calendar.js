'use strict';
// Add confirmed meeting details under the month the SIG meeting is for.
const MEETING_DETAILS = {
  '2026-11': {
    date: '2026-12-02',
    time: '下午',
    status: '待开始',
    agenda: [
      '议题一：Agent Solution仓1130版本发布宣讲（付英杰） --- 20min',
      '议题二：智能体特性平台化建设相关内容（陶奕） --- 40min',
      '议题三：Agent Solution新特性解读及demo演示（袁作松） --- 40min',
      '议题四：智能体平台网关协议及应用（尤国庆） --- 30min',
      '议题五：开放讨论'
    ]
  },
  '2026-10': {
    status: '已结束',
    platform: '线下会议（练秋湖B4-3-18R）& welink线上',
    meetingId: '99121984（welink客户端接入需输会议密码：203658）',
    link: 'https://app.huawei.com/wmeeting/join/99121984/mTY15AoqX45tTU8Ew0fQtAAcMYeXakeht',
    agenda: ['议题一：Agent Solution仓1030版本发布宣讲', '议题二：电力行业SIG成立申请', '议题三：AI 原生钢厂建设思路介绍', '议题四：冶金行业SIG成立申请', '议题五：开放讨论']
  },
  '2026-09': {
    day: 30,
    title: 'OpenJiuwen Agent Solution 九月SIG会议',
    status: '已结束',
    platform: 'welink线上',
    meetingId: '94182955（welink客户端接入需输会议密码：704281）',
    link: 'https://app.huawei.com/wmeeting/join/94182955/wWlUutXxsOcuNPxFTgGFJ1nS31mHNWUwh',
    agenda: ['议题一：Agent Solution仓930版本发布宣讲', '议题二：openJiuwen开发范式宣讲', '议题三：开放讨论']
  },
  '2026-08': {
    day: 26,
    title: 'OpenJiuwen Agent Solution 八月SIG会议',
    status: '已结束',
    platform: 'welink线上',
    meetingId: '96825204（welink客户端接入需输会议密码：881330）',
    link: 'https://app.huawei.com/wmeeting/join/96825204/f2CRXVqp6Y86Ij16eP5I0hsBTdEsrrgXt',
    agenda: ['议题一：Agent Solution仓830版本发布评审', '议题二：智能体架构H2规划', '议题三：研讨议题：行业SIG筹备讨论', '议题四：开放讨论']
  },
  '2026-07': {
    day: 22,
    title: 'OpenJiuwen Agent Solution 七月SIG会议',
    status: '已结束',
    platform: '线下会议（练秋湖B4-3-18R）& welink线上',
    meetingId: '95272456（welink客户端接入需输会议密码：693961）',
    link: 'https://app.huawei.com/wmeeting/join/95272456/KbEGsZWVHHICwbWSulH5BZz0M5EyXAzX9',
    agenda: ['议题一：Openjiuwen的平台能力规划和进展宣讲', '议题二：社区管理与方向性决策（SIG运作机制宣讲）', '议题三：金融实战案例分享', '议题四：开放讨论']
  }
};
const MONTH_NAMES = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
const SNAPSHOT_DAY = '2026-11-20';
let year=2026, month=11, range=2, selectedDay=null, page=1, expanded=null;
const $ = selector => document.querySelector(selector);
const pad = n => String(n).padStart(2,'0');
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lastWednesday(y,m){const last=new Date(Date.UTC(y,m+1,0));return last.getUTCDate()-(last.getUTCDay()-3+7)%7;}
function getMeeting(key){
  const [meetingYear, meetingMonth] = key.split('-').map(Number);
  const confirmed = MEETING_DETAILS[key] || {};
  const date = confirmed.date ?? `${key}-${pad(confirmed.day ?? lastWednesday(meetingYear, meetingMonth-1))}`;
  const title = `openJiuwen Agent Solution ${MONTH_NAMES[meetingMonth-1]}月SIG会议`;
  const status = date < SNAPSHOT_DAY ? '已结束' : '待开始';
  return {key, title, status, ...confirmed, date, day:Number(date.slice(-2))};
}
function meetingsInMonth(y,m){
  const key = `${y}-${pad(m+1)}`;
  const scheduled = getMeeting(key);
  const movedIntoMonth = Object.entries(MEETING_DETAILS)
    .filter(([meetingKey, detail]) => meetingKey !== key && detail.date?.startsWith(`${key}-`))
    .map(([meetingKey]) => getMeeting(meetingKey));
  if(scheduled.date.startsWith(`${key}-`)) movedIntoMonth.push(scheduled);
  return movedIntoMonth.sort((a,b) => a.day-b.day);
}
function meetings(){
  if(selectedDay!==null)return meetingsInMonth(year,month).filter(event=>event.day===selectedDay);
  return Array.from({length:range},(_,i)=>{
    const d=new Date(Date.UTC(year,month-i,1));
    return meetingsInMonth(d.getUTCFullYear(),d.getUTCMonth());
  }).flat();
}
function renderCalendar(){
  $('#month-title').textContent=`${year}年${month+1}月`;
  const offset=new Date(Date.UTC(year,month,1)).getUTCDay();
  const monthMeetings=meetingsInMonth(year,month);
  let html=['日','一','二','三','四','五','六'].map(d=>`<div class="calendarWeekday_cbRA">${d}</div>`).join('');
  for(let i=0;i<42;i++){
    const d=new Date(Date.UTC(year,month,1-offset+i));const day=d.getUTCDate(),inside=d.getUTCMonth()===month;
    const meeting=inside&&monthMeetings.some(event=>event.day===day),date=`${year}-${pad(month+1)}-${pad(day)}`;
    const classes=['calendarDay_XQwx',!inside?'calendarDayOtherMonth_Z7ER':'',inside&&!meeting&&date<SNAPSHOT_DAY?'calendarDayPast_DjQy':'',meeting?'sig-meeting calendarDayToday_TNxy':'',inside&&day===selectedDay?(meeting?'calendarDaySelected_bq2U':'sig-neutral-selected'):''].filter(Boolean).join(' ');
    html+=`<button type="button" class="${classes}" ${inside?`data-day="${day}"`:'disabled tabindex="-1"'} aria-label="${d.getUTCFullYear()}年${d.getUTCMonth()+1}月${day}日${meeting?'，Solution SIG会议':''}" aria-pressed="${inside&&day===selectedDay}"><span class="calendarDayNumber_s8Km">${day}</span>${meeting?'<span class="calendarDayEvents_cSXP"><img class="calendarDayEventIcon_Fra5" src="assets/metting.svg" alt="会议"></span>':''}</button>`;
  }
  $('#calendar-grid').innerHTML=html;
}
function details(event){
  const rows=[['名称',escapeHTML(event.title)],['状态',event.status],['平台',escapeHTML(event.platform||'待公布')],['会议ID',escapeHTML(event.meetingId||'待公布')],['参会链接',event.link?`<a class="calendarEventDetailLink_FeL5" href="${escapeHTML(event.link)}" target="_blank" rel="noopener noreferrer">${escapeHTML(event.link)}</a>`:'待公布'],['议题信息',event.agenda?event.agenda.map(t=>`<span class="sig-agenda">${escapeHTML(t)}</span>`).join(''):'待公布']];
  return rows.map(([label,value])=>`<div class="calendarEventDetailRow_NKTC"><dt class="calendarEventDetailLabel_FbsE">${label}：</dt><dd class="calendarEventDetailValue_ILW2">${value}</dd></div>`).join('');
}
function closeDetails(){expanded=null;renderEvents();}
function renderEvents(){
  const list=meetings(),total=Math.max(1,Math.ceil(list.length/5));page=Math.max(1,Math.min(page,total));
  $('#events-title').textContent=selectedDay===null?'近期活动':`${year}年${month+1}月${selectedDay}日 的活动`;
  $('#time-range').hidden=selectedDay!==null;$('#clear-selection').hidden=selectedDay===null;
  $('#events-list').innerHTML=list.length?list.slice((page-1)*5,page*5).map(event=>{
    const open=expanded===event.key,past=event.status==='已结束';
    const dateLabel=event.time?`${event.date} ${escapeHTML(event.time)}`:event.date;
    return `<article class="calendarEventItemWrapper_DygL"><div class="calendarEventItem_HNM6 ${past?'calendarEventItemPast_Dpdo':''} ${open?'calendarEventItemHasDrawerDown_HDJa':''}"><div class="calendarEventHeader_Xb2O" data-toggle="${event.key}"><img class="calendarEventIcon_Wl69" src="assets/metting.svg" alt="会议"><div class="calendarEventContent_C3Im"><div class="calendarEventDate_LRhf">${dateLabel}<span class="calendarEventStatusTag__ynt ${past?'calendarEventStatusCompleted_lnRd':'calendarEventStatusUpcoming_q7Ig'}">${event.status}</span></div><div class="calendarEventTitle_LmKv">${escapeHTML(event.title)}</div></div><button type="button" class="calendarEventExpandButton_KEF3" aria-expanded="${open}" aria-controls="details-${event.key}">${open?'收起详情':'展开详情'}</button></div></div><dl id="details-${event.key}" class="calendarEventDetailsDrawer_CS48 ${open?'calendarEventDetailsDrawerExpanded_A9Qr':''}" ${open?'':'hidden'} aria-label="${escapeHTML(event.title)}详情">${details(event)}</dl></article>`;
  }).join(''):'<div class="calendarNoEvents_E24b">当日暂无会议安排</div>';
  $('#page-info').textContent=`${page} / ${total}`;$('#prev-page').disabled=page===1;$('#next-page').disabled=page===total;
}
function render(){renderCalendar();renderEvents();}
function changeMonth(delta){const d=new Date(Date.UTC(year,month+delta,1));year=d.getUTCFullYear();month=d.getUTCMonth();selectedDay=null;page=1;expanded=null;render();}
$('#prev-month').addEventListener('click',()=>changeMonth(-1));$('#next-month').addEventListener('click',()=>changeMonth(1));
$('#calendar-grid').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(!b)return;selectedDay=Number(b.dataset.day);page=1;expanded=null;render();});
$('#clear-selection').addEventListener('click',()=>{selectedDay=null;page=1;expanded=null;render();});
$('#time-range').addEventListener('change',e=>{range=Number(e.target.value);page=1;expanded=null;renderEvents();});
$('#meeting-tab').addEventListener('click',()=>{selectedDay=null;page=1;expanded=null;render();});
$('#events-list').addEventListener('click',e=>{const header=e.target.closest('[data-toggle]');if(!header)return;expanded=expanded===header.dataset.toggle?null:header.dataset.toggle;renderEvents();const button=$(`[data-toggle="${header.dataset.toggle}"] button`);button?.focus({preventScroll:true});});
$('#prev-page').addEventListener('click',()=>{page--;expanded=null;renderEvents();});$('#next-page').addEventListener('click',()=>{page++;expanded=null;renderEvents();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDetails();document.querySelectorAll('.sig-menu-open').forEach(x=>x.classList.remove('sig-menu-open'));if($('#mobile-menu'))$('#mobile-menu').hidden=true;}});
document.addEventListener('click',e=>{if(expanded&&!e.target.closest('.calendarEventItemWrapper_DygL'))closeDetails();});
// Keep the original site's navigation links and dropdowns available locally.
document.querySelectorAll('.menuButton_py_u').forEach(b=>{b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>{const p=b.parentElement;p.classList.toggle('sig-menu-open');b.setAttribute('aria-expanded',String(p.classList.contains('sig-menu-open')));});});
const mobileMenu=document.createElement('nav');mobileMenu.className='sig-mobile-menu';mobileMenu.id='mobile-menu';mobileMenu.hidden=true;mobileMenu.setAttribute('aria-label','移动端导航');
mobileMenu.innerHTML=[['下载','download'],['学习','docs-page'],['社区','community'],['项目','https://atomgit.com/openJiuwen'],['文档','docs-page'],['动态','news-page'],['关于','about/governance']].map(([label,path])=>`<a href="${path.startsWith('https')?path:'https://openjiuwen.com/'+path}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('');document.body.append(mobileMenu);
$('.navbar__toggle')?.addEventListener('click',e=>{mobileMenu.hidden=!mobileMenu.hidden;e.currentTarget.setAttribute('aria-expanded',String(!mobileMenu.hidden));});
function updateNav(){$('.navbar').classList.toggle('navbar--scrolled',window.scrollY>50);}
window.addEventListener('scroll',updateNav,{passive:true});updateNav();render();
