<div class="col s12 m6">
	<div class="col m12 s12 card">
		<a target="_blank" href="/missingPet/detail/{{id}}">
			<div class="card-image waves-effect waves-block waves-light">
				<div id="mainPicture{{id}}">
					<div id="loader{{id}}" class="loader">
				 	<img id="master-picture{{id}}" class="activator master-picture" src="{{mainPictureUrl}}">
				 	</div>
				</div>
				<span class="card-title activator master-name col s12 grey image-title">
					名稱：{{name}}
					<i class="material-icons right">more_vert</i>
				</span>
			</div>
		</a>
		<div class="card-content flow-text">
			<div class="col s5 column1 truncate">
				<p class="master-kind">
					類別：{{kind}}
				</p>
				<p class="master-breed">
					品種：{{breed}}
				</p>
				<p class="master-color">
					花色：{{color}}
				</p>
				<p class="master-gender">
					性別：{{genderToChinses gender}}	
				</p>					
			</div>
			<div class="col s7 column2">
				<p class="master-location truncate">
					走失地點：{{location}}
				</p>
				<p class="master-missingDate">
					走失日期：<br>
					<p class="text-right">{{localDateFormat missingDate}}</p>
				</p>
				<p class="master-mostDistantFuture">
					更新日期：<br>
					<p class="text-right">{{lastUpdatedDate createdAt updatedAt}}</p>
				</p>
			</div>
		</div>
	</div>
</div>