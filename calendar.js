'use strict';
// Calendar snapshot: October 2026. Add confirmed meeting details in this map.
const MEETING_DETAILS = {
  '2026-10': {
    platform: '线下会议（练秋湖B4-3-18R）& welink线上',
    meetingId: '99121984（welink客户端接入需输会议密码：203658）',
    link: 'https://app.huawei.com/wmeeting/join/99121984/mTY15AoqX45tTU8Ew0fQtAAcMYeXakeht',
    agenda: ['议题一：Agent Solution仓1030版本发布宣讲', '议题二：南网电力行业SIG成立申请', '议题三：AI 原生钢厂建设思路及冶金SIG筹建申请', '议题四：开放讨论']
  }
};
const MONTH_NAMES = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
const SNAPSHOT_DAY = '2026-10-26';
let year=2026, month=9, range=2, selectedDay=null, page=1, expanded=null;
const $ = selector => document.querySelector(selector);
const pad = n => String(n).padStart(2,'0');
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lastWednesday(y,m){const last=new Date(Date.UTC(y,m+1,0));return last.getUTCDate()-(last.getUTCDay()-3+7)%7;}
function getMeeting(y,m){
  const key=`${y}-${pad(m+1)}`, day=lastWednesday(y,m),date=`${key}-${pad(day)}`;
  // September spelling follows the supplied copy verbatim.
  const prefix=y===2026&&m===8?'penJiuwen':'openJiuwen';
  return {key,year:y,month:m,day,date,title:`${prefix} Agent Solution ${MONTH_NAMES[m]}月SIG会议`,status:date<SNAPSHOT_DAY?'已结束':'待开始',...MEETING_DETAILS[key]};
}
function meetings(){
  if(selectedDay!==null)return selectedDay===lastWednesday(year,month)?[getMeeting(year,month)]:[];
  return Array.from({length:range},(_,i)=>{const d=new Date(Date.UTC(year,month-i,1));return getMeeting(d.getUTCFullYear(),d.getUTCMonth());});
}
function renderCalendar(){
  $('#month-title').textContent=`${year}年${month+1}月`;
  const offset=new Date(Date.UTC(year,month,1)).getUTCDay();
  let html=['日','一','二','三','四','五','六'].map(d=>`<div class="calendarWeekday_cbRA">${d}</div>`).join('');
  for(let i=0;i<42;i++){
    const d=new Date(Date.UTC(year,month,1-offset+i));const day=d.getUTCDate(),inside=d.getUTCMonth()===month;
    const meeting=inside&&day===lastWednesday(year,month),date=`${year}-${pad(month+1)}-${pad(day)}`;
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
    return `<article class="calendarEventItemWrapper_DygL"><div class="calendarEventItem_HNM6 ${past?'calendarEventItemPast_Dpdo':''} ${open?'calendarEventItemHasDrawerDown_HDJa':''}"><div class="calendarEventHeader_Xb2O" data-toggle="${event.key}"><img class="calendarEventIcon_Wl69" src="assets/metting.svg" alt="会议"><div class="calendarEventContent_C3Im"><div class="calendarEventDate_LRhf">${event.date}<span class="calendarEventStatusTag__ynt ${past?'calendarEventStatusCompleted_lnRd':'calendarEventStatusUpcoming_q7Ig'}">${event.status}</span></div><div class="calendarEventTitle_LmKv">${escapeHTML(event.title)}</div></div><button type="button" class="calendarEventExpandButton_KEF3" aria-expanded="${open}" aria-controls="details-${event.key}">${open?'收起详情':'展开详情'}</button></div></div><dl id="details-${event.key}" class="calendarEventDetailsDrawer_CS48 ${open?'calendarEventDetailsDrawerExpanded_A9Qr':''}" ${open?'':'hidden'} aria-label="${escapeHTML(event.title)}详情">${details(event)}</dl></article>`;
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
