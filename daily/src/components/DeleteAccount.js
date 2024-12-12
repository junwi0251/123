import React, { useState } from "react";
import styles from "../css/DeleteAccount.module.css"; // CSS 파일 import

function DeleteAccount() {
    const [confirmed, setConfirmed] = useState(false);

    const handleDelete = () => {
        // 탈퇴 처리 로직
        console.log("회원탈퇴가 완료되었습니다.");
        alert("회원탈퇴가 완료되었습니다.");
        window.location.href = "http://localhost:3000"; // 홈으로 리다이렉트
    };

    return (
        <div className={styles.DAContainer}>
            {!confirmed ? (
                <div className={styles.DAMessageBox}>
                    <h1 className={styles.DAHeading}>회원 탈퇴 안내</h1>
                    <p className={styles.DAText}>
                        회원 탈퇴 시, 귀하의 모든 데이터는 삭제되며 복구가 불가능합니다.
                        <br />
                        탈퇴 후에도 법적 의무에 따라 일부 데이터는 일정 기간 보관될 수 있습니다.<br />
                    </p>
                    <p className={styles.DAText}>
                        탈퇴 후에는 기존에 사용했던 아이디로 다시 가입할 수 없으며 아이디와 데이터는 복구할 수 없습니다.
                    </p>
                    <p className={styles.DAText}>
                        정말 회원 탈퇴를 원하신다면 아래 버튼을 클릭해주세요.
                    </p>
                    <button
                        className={styles.DAConfirmButton}
                        onClick={() => setConfirmed(true)}
                    >
                        탈퇴하기
                    </button>
                </div>
            ) : (
                <div className={styles.DAConfirmBox}>
                    <h2 className={styles.DAHeading}>정말 탈퇴하시겠습니까?</h2>
                    <div className={styles.DAButtonContainer}>
                        <button
                            className={styles.DACancelButton}
                            onClick={() => setConfirmed(false)}
                        >
                            취소
                        </button>
                        <button
                            className={styles.DADeleteButton}
                            onClick={handleDelete}
                        >
                            네, 탈퇴합니다
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeleteAccount;
